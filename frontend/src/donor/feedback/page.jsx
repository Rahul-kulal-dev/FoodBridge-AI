import React from 'react';
import { MessageSquare, Star } from 'lucide-react';

const DonorFeedbackPage = () => {
  const reviews = [
    { name: 'Hope Harvest Shelter', rating: 5, comment: 'The fresh organic vegetables were distributed to 140 families in our evening food drive. Exceptional quality!', date: 'Yesterday' },
    { name: 'St. Jude Youth Center', rating: 5, comment: 'Timely pickup coordination and neatly packaged bakery goods. Thank you GreenHarvest!', date: '3 days ago' },
  ];

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] shadow-soft-card">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-[-0.045em]">
              Recipient Feedback & Impact Reviews
            </h1>
            <p className="text-xs text-[#64748B]">
              Direct notes and verified impact feedback from food banks and shelters.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-soft-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0F172A]">{rev.name}</h3>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                {[...Array(rev.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#334155] italic">"{rev.comment}"</p>
            <div className="text-[11px] text-[#64748B]">{rev.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorFeedbackPage;
