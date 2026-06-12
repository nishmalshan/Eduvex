import React from 'react';
import {
  Clock, User, Briefcase, Link2, CheckCircle2, BookOpen, Mail
} from 'lucide-react';

const EXPERIENCE_LABELS = {
  beginner: { label: '0–1 years', desc: 'Just starting out' },
  intermediate: { label: '2–4 years', desc: 'Building experience' },
  expert: { label: '5–9 years', desc: 'Seasoned professional' },
  master: { label: '10+ years', desc: 'Industry veteran' },
};

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700 border-green-200' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' },
};

const ApplicationUnderReview = ({ application }) => {
  const exp = EXPERIENCE_LABELS[application.experience] ?? { label: application.experience, desc: '' };
  const status = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.pending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 tracking-tight mb-1">EDUVEX</h1>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Tutor Application</p>
        </div>

        {/* Status Banner */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-full px-5 py-2.5 mb-3">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Application Under Review</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Your application is being reviewed</h2>
          <p className="text-gray-400 text-sm text-center">
            Our team will get back to you within 3–5 business days
          </p>
        </div>

        <div className="space-y-4">

          {/* Name + Photo */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            {application.profilePhotoUrl ? (
              <img
                src={application.profilePhotoUrl}
                alt={application.fullName}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-500" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Full Name</p>
              <p className="text-base font-semibold text-gray-800">{application.fullName}</p>
            </div>
            <div className="ml-auto">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${status.color}`}>
                Under Review
                {/* {status.label} */}
              </span>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bio</p>
            <p className="text-sm text-gray-700 leading-relaxed">{application.bio}</p>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Experience Level</p>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-800">{exp.label}</span>
              <span className="text-sm text-gray-400">· {exp.desc}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Skills</p>
            <div className="flex flex-wrap gap-2">
              {application.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full border border-blue-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Teaching Categories</p>
            <div className="flex flex-wrap gap-2">
              {application.categories.map((cat) => (
                <span
                  key={cat}
                  className="bg-gray-50 text-gray-600 text-sm font-medium px-3 py-1 rounded-full border border-gray-200"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {(application.linkedin || application.portfolio) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {application.linkedin && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">LinkedIn</p>
                  <a
                    href={`https://linkedin.com/in/${application.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1.5"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    linkedin.com/in/{application.linkedin}
                  </a>
                </div>
              )}
              {application.portfolio && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Portfolio</p>
                    <a
                    href={application.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1.5 break-all"
                  >
                    <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
                    {application.portfolio}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Info note */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <Mail className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              You'll receive an email notification once a decision has been made.
              For questions, reach us at{' '}
              <span className="font-semibold">support@eduvex.com</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ApplicationUnderReview;