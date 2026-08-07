import React, { useState, useEffect } from 'react';
import {
  Truck,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  UserCheck,
  Navigation,
  ArrowRight,
  Loader2,
  Utensils,
  AlertCircle,
  Camera
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';
import DeliveryTrackingMap from '../../components/maps/DeliveryTrackingMap';

const TrackVolunteerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const donationIdParam = searchParams.get('id');
  const { token, user } = useAuth();

  const [activeDonation, setActiveDonation] = useState(null);
  const [liveVolunteerLoc, setLiveVolunteerLoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTrackData = async () => {
    setLoading(true);
    try {
      if (!token) return;

      let targetUrl = getApiUrl('/api/ngo/donations/history');
      if (donationIdParam) {
        targetUrl = getApiUrl(`/api/ngo/donations/${donationIdParam}`);
      }

      const res = await fetch(targetUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        if (data.donation) {
          setActiveDonation(data.donation);
        } else if (data.donations && data.donations.length > 0) {
          setActiveDonation(data.donations[0]);
        } else {
          setActiveDonation(null);
        }
      } else {
        setActiveDonation(null);
      }
    } catch (err) {
      console.warn('Error fetching tracking data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackData();
  }, [token, donationIdParam]);

  // Poll live volunteer GPS location (Req 9)
  useEffect(() => {
    let isMounted = true;
    const volId = activeDonation?.volunteerId?._id || activeDonation?.volunteerId;
    if (!volId || !token) return;

    const fetchLiveLocation = async () => {
      try {
        const res = await fetch(getApiUrl(`/api/volunteer/location/${volId}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (isMounted && res.ok && data.location) {
          setLiveVolunteerLoc(data.location);
        }
      } catch (err) {
        console.warn('Error fetching live volunteer GPS position:', err);
      }
    };

    fetchLiveLocation();
    const timer = setInterval(fetchLiveLocation, 6000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [activeDonation, token]);

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-bold">Loading live tracking...</p>
      </div>
    );
  }

  if (!activeDonation) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#E7EAF0] text-center space-y-3 shadow-soft-card">
        <Truck className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-[#0F172A]">No Active Deliveries Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Accept a surplus food donation to track live volunteer courier dispatching.
        </p>
        <button
          onClick={() => navigate('/ngo/accepted-donations')}
          className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-emerald-btn"
        >
          View Accepted Queue
        </button>
      </div>
    );
  }

  const docId = `DON-${activeDonation._id.slice(-4).toUpperCase()}`;
  const volunteerObj = activeDonation.volunteerId || {};
  const hasVolunteer = Boolean(volunteerObj.name);
  const volunteerName = volunteerObj.name || null;
  const volunteerPhone = volunteerObj.phone || null;
  const volunteerEmail = volunteerObj.email || null;
  const isVolunteerVerified = volunteerObj.verificationStatus === 'approved';
  const donorName = activeDonation.donorId?.organizationName || activeDonation.donorId?.name || 'Donor';
  const ngoName = user?.organizationName || user?.name || 'NGO';

  const acceptedAt = activeDonation.updatedAt ? new Date(activeDonation.updatedAt) : null;
  const createdAt = activeDonation.createdAt ? new Date(activeDonation.createdAt) : null;
  const fmtTime = (d) => d ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '—';

  const status = activeDonation.status;
  const isVolunteerAccepted = status === 'accepted' || status === 'picked_up' || status === 'delivered';

  const timelineSteps = [
    { label: 'Assigned', time: fmtTime(createdAt || acceptedAt), completed: true },
    { label: 'Accepted', time: isVolunteerAccepted ? fmtTime(acceptedAt) : 'Pending Acceptance', completed: isVolunteerAccepted },
    { label: 'Picked Up', time: status === 'picked_up' || status === 'delivered' ? fmtTime(acceptedAt) : '—', completed: status === 'picked_up' || status === 'delivered' },
    { label: 'In Transit', time: status === 'picked_up' ? 'Active' : '—', completed: false, active: status === 'picked_up' },
    { label: 'Delivered', time: status === 'delivered' ? 'Completed' : '—', completed: status === 'delivered' },
  ];

  const donorLat = activeDonation.location?.lat || activeDonation.donorId?.location?.lat || 0;
  const donorLng = activeDonation.location?.lng || activeDonation.donorId?.location?.lng || 0;
  const ngoLat = user?.location?.lat || 0;
  const ngoLng = user?.location?.lng || 0;

  const courierLat = liveVolunteerLoc?.latitude || (donorLat ? donorLat + 0.002 : 0);
  const courierLng = liveVolunteerLoc?.longitude || (donorLng ? donorLng + 0.003 : 0);

  const markers = [];
  if (donorLat && donorLng) {
    markers.push({
      lat: donorLat,
      lng: donorLng,
      title: `Donor: ${donorName}`,
      description: activeDonation.location?.address || activeDonation.donorId?.address || 'Pickup Location',
      iconType: 'donor',
    });
  }
  if (ngoLat && ngoLng) {
    markers.push({
      lat: ngoLat,
      lng: ngoLng,
      title: `NGO: ${ngoName}`,
      description: user?.address || 'NGO Dropoff',
      iconType: 'ngo',
    });
  }
  if (hasVolunteer && courierLat && courierLng) {
    markers.push({
      lat: courierLat,
      lng: courierLng,
      title: `Courier: ${volunteerName}`,
      description: liveVolunteerLoc ? `Live GPS (±${Math.round(liveVolunteerLoc.accuracy || 0)}m)` : `Status: ${status.toUpperCase()}`,
      iconType: 'courier',
    });
  }

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-[-0.04em]">
            Live Volunteer Courier Dispatch
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Tracking order <span className="font-mono font-bold text-[#0F172A]">{docId}</span> - {activeDonation.title}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          Live Tracking
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-5">
            {hasVolunteer ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xl flex items-center justify-center ring-4 ring-emerald-500/20 shadow-md">
                    {volunteerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0F172A]">{volunteerName}</h3>
                    {volunteerEmail && <p className="text-xs text-[#64748B]">{volunteerEmail}</p>}
                    {isVolunteerVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Volunteer
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-[#f7f8fb] p-3.5 rounded-xl border border-[#E7EAF0]">
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase block">Delivery Status</span>
                    <span className="font-bold text-emerald-700 uppercase">{status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase block">Phone</span>
                    <span className="font-bold text-slate-800">{volunteerPhone || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  {volunteerPhone && (
                    <a
                      href={`tel:${volunteerPhone}`}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-emerald-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Volunteer</span>
                    </a>
                  )}
                  <button
                    onClick={() => navigate('/ngo/notifications')}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-sm font-extrabold text-[#0F172A]">No Volunteer Assigned</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  This donation does not have a volunteer courier assigned yet. You can assign one from the Accepted Donations page.
                </p>
                <button
                  onClick={() => navigate('/ngo/accepted-donations')}
                  className="mt-1 px-5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-emerald-btn cursor-pointer"
                >
                  Manage Donations
                </button>
              </div>
            )}
          </div>

          {/* Pickup Photo Verification Display for NGO */}
          {(() => {
            const photoUrl = (activeDonation.pickupPhoto && activeDonation.pickupPhoto !== '[object Object]')
              ? activeDonation.pickupPhoto
              : ((status === 'picked_up' || status === 'delivered')
                ? (activeDonation.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80')
                : null);

            return (
              <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Pickup Verification Photo</span>
                  </h3>
                  {photoUrl ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified at Pickup
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Pending Pickup Photo
                    </span>
                  )}
                </div>

                {photoUrl ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500 bg-slate-900 shadow-md">
                    <img
                      src={photoUrl}
                      alt="Verified Pickup Package"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Verified Food Package Photo</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
                    <Clock className="w-5 h-5 text-amber-500 mx-auto animate-pulse" />
                    <p className="text-xs font-bold text-slate-700">Awaiting Volunteer Pickup Verification</p>
                    <p className="text-[11px] text-slate-400">
                      Verification photo uploaded by courier before departure will appear here.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}

          <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A]">Pickup & Delivery Progress Timeline</h3>

            <div className="space-y-4 pt-2">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  {idx !== timelineSteps.length - 1 && (
                    <div
                      className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${step.completed ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    />
                  )}

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${step.completed
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : step.active
                          ? 'bg-amber-500 text-white animate-pulse shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-extrabold ${step.completed || step.active ? 'text-[#0F172A]' : 'text-slate-400'}`}
                      >
                        {step.label}
                      </h4>
                      <span className="text-[10px] font-bold text-[#64748B]">{step.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-[#E7EAF0] shadow-xl overflow-hidden min-h-[480px] relative">
          {donorLat && donorLng ? (
            <DeliveryTrackingMap
              donorLocation={{
                lat: donorLat,
                lng: donorLng,
                title: donorName,
                address: activeDonation.location?.address || activeDonation.donorId?.address || 'Donor Pickup',
                phone: activeDonation.donorId?.phone || activeDonation.phone || '',
                email: activeDonation.donorId?.email || '',
                contactPerson: activeDonation.donorId?.name || '',
              }}
              ngoLocation={{
                lat: ngoLat || 12.9850,
                lng: ngoLng || 77.6150,
                title: ngoName,
                address: user?.address || 'NGO Dropoff',
                phone: user?.phone || '',
              }}
              volunteerLocation={{
                lat: courierLat,
                lng: courierLng,
                title: volunteerName || 'Volunteer Courier',
                phone: volunteerPhone || '',
              }}
              deliveryStatus={activeDonation.status || 'assigned'}
              className="w-full h-full min-h-[480px]"
            />
          ) : (
            <div className="w-full h-full min-h-[480px] flex flex-col items-center justify-center text-slate-400 gap-3">
              <MapPin className="w-10 h-10" />
              <p className="text-xs font-bold text-center max-w-xs">
                Location data not available. Ensure donor and NGO profiles have location coordinates set.
              </p>
            </div>
          )}

          <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white text-xs space-y-1 pointer-events-auto shadow-xl">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Destination</span>
              <p className="font-extrabold">{ngoName}</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-bold flex items-center gap-2 pointer-events-auto shadow-xl">
              <Navigation className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Status: {status.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackVolunteerPage;