import React, { useState, useRef } from 'react';
import {
  User, FileText, Zap, Briefcase, Link2, Camera, BookOpen,
  ChevronRight, ChevronLeft, Check, Upload, X, Plus, Loader2
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearError, submitTutorApplication } from '../../redux/features/tutorApplicationSlice';

const STEPS = [
  { id: 1, label: 'Personal', icon: User },
  { id: 2, label: 'Expertise', icon: Zap },
  { id: 3, label: 'Profile', icon: Camera },
  { id: 4, label: 'Review', icon: Check },
];

const CATEGORIES = [
  'Web Development', 'Data Science', 'Design (UI/UX)', 'Mobile Development',
  'Machine Learning', 'Cybersecurity', 'Cloud Computing', 'DevOps',
  'Game Development', 'Digital Marketing', 'Business & Finance', 'Photography',
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: '0–1 years', desc: 'Just starting out' },
  { value: 'intermediate', label: '2–4 years', desc: 'Building experience' },
  { value: 'expert', label: '5–9 years', desc: 'Seasoned professional' },
  { value: 'master', label: '10+ years', desc: 'Industry veteran' },
];

const TutorApplicationForm = () => {
      
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileRef = useRef();

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullName: '',
    bio: '',
    skills: [],
    experience: '',
    linkedin: '',
    portfolio: '',
    photo: null,
    categories: [],
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const addSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && skillInput.trim()) {
      e.preventDefault();
      const val = skillInput.trim().replace(/,$/, '');
      if (val && !form.skills.includes(val)) {
        update('skills', [...form.skills, val]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (s) => update('skills', form.skills.filter(x => x !== s));

  const toggleCategory = (cat) => {
    if (form.categories.includes(cat)) {
      update('categories', form.categories.filter(c => c !== cat));
    } else if (form.categories.length < 3) {
      update('categories', [...form.categories, cat]);
    }
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    update('photo', file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const canProceed = () => {
    if (step === 1) return form.fullName.trim().length > 1 && form.bio.trim().length > 20;
    if (step === 2) return form.skills.length > 0 && form.experience && form.categories.length > 0;
    if (step === 3) return true;
    return true;
  };

  // ─────────────────────────────────────────────
  // SUBMIT HANDLER
  // Builds a FormData payload (needed for file upload)
  // and POSTs to the backend API.
  // ─────────────────────────────────────────────

  const handleSubmit = async () => {
    console.log('0000000000000000000')
    setIsLoading(true);
    setSubmitError(null);
    dispatch(clearError());
console.log(form,'form')
    // ── Submit — dispatch the AsyncThunk
     const result = await dispatch(submitTutorApplication(form))
    if (submitTutorApplication.fulfilled.match(result)) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
          <p className="text-gray-500 mb-2 text-lg">
            Thank you, <span className="text-blue-600 font-semibold">{form.fullName}</span>!
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Our team will review your application and get back to you within 3–5 business days.
          </p>
          <button
            onClick={() => { setSubmitted(false); setStep(1); setForm({ fullName: '', bio: '', skills: [], experience: '', linkedin: '', portfolio: '', photo: null, categories: [] }); setPhotoPreview(null); }}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-600 tracking-tight mb-1">EDUVEX</h1>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Tutor Application</p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-between mb-10 px-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
                    ${done ? 'bg-blue-600 border-blue-600' : active ? 'bg-white border-blue-600 shadow-md shadow-blue-100' : 'bg-white border-gray-200'}`}>
                    {done
                      ? <Check className="w-5 h-5 text-white" />
                      : <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-300'}`} />
                    }
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${active ? 'text-blue-600' : done ? 'text-blue-400' : 'text-gray-300'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded transition-all duration-500 ${step > s.id ? 'bg-blue-400' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Step 1 — Personal Info */}
          {step === 1 && (
            <div className="p-8">
              <StepHeader icon={User} title="Personal Information" subtitle="Tell us a bit about yourself" />
              <div className="space-y-5 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <Req /></label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => update('fullName', e.target.value)}
                    placeholder="e.g. Sarah Johnson"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-300 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio / About <Req /></label>
                  <textarea
                    value={form.bio}
                    onChange={e => update('bio', e.target.value)}
                    placeholder="Write a compelling bio that tells students about your teaching approach, background, and passion..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-300 resize-none transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.bio.length} characters · Minimum 20</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Expertise */}
          {step === 2 && (
            <div className="p-8">
              <StepHeader icon={Zap} title="Skills & Expertise" subtitle="Help students find the right tutor" />
              <div className="space-y-6 mt-6">

                {/* Skills */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skills <Req /></label>
                  <div className={`flex flex-wrap gap-2 p-3 rounded-xl border transition ${form.skills.length > 0 ? 'border-gray-200' : 'border-gray-200'} focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent`}>
                    {form.skills.map(s => (
                      <span key={s} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                        {s}
                        <button onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                      placeholder={form.skills.length === 0 ? 'Type a skill and press Enter...' : 'Add more...'}
                      className="flex-1 min-w-32 outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Press Enter or space to add each skill</p>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level <Req /></label>
                  <div className="grid grid-cols-2 gap-3">
                    {EXPERIENCE_LEVELS.map(exp => (
                      <button
                        key={exp.value}
                        onClick={() => update('experience', exp.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${form.experience === exp.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'}`}
                      >
                        <p className={`text-sm font-bold ${form.experience === exp.value ? 'text-blue-600' : 'text-gray-700'}`}>{exp.label}</p>
                        <p className={`text-xs mt-0.5 ${form.experience === exp.value ? 'text-blue-400' : 'text-gray-400'}`}>{exp.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teaching Category <Req /></label>
                  <p className="text-xs text-gray-400 mb-2">Pick up to 3 categories</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => {
                      const selected = form.categories.includes(cat);
                      const maxed = form.categories.length >= 3 && !selected;
                      return (
                        <button
                          key={cat}
                          disabled={maxed}
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                            ${selected ? 'bg-blue-600 text-white border-blue-600' : maxed ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'}`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Profile Links & Photo */}
          {step === 3 && (
            <div className="p-8">
              <StepHeader icon={Camera} title="Profile & Links" subtitle="Complete your public tutor profile" />
              <div className="space-y-6 mt-6">

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo</label>
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center flex-shrink-0">
                      {photoPreview
                        ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        : <Camera className="w-7 h-7 text-blue-300" />
                      }
                    </div>
                    <div>
                      <button
                        onClick={() => fileRef.current.click()}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                      </button>
                      <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or WebP · Max 5MB</p>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  </div>
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">LinkedIn Profile</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">linkedin.com/in/</span>
                    <input
                      type="text"
                      value={form.linkedin}
                      onChange={e => update('linkedin', e.target.value)}
                      placeholder="yourhandle"
                      className="w-full pl-36 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-300 transition"
                    />
                  </div>
                </div>

                {/* Portfolio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Portfolio / Website</label>
                  <div className="relative">
                    <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="url"
                      value={form.portfolio}
                      onChange={e => update('portfolio', e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-300 transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && (
            <div className="p-8">
              <StepHeader icon={Check} title="Review & Submit" subtitle="Double-check everything before submitting" />
              <div className="mt-6 space-y-4">

                <ReviewCard label="Full Name" value={form.fullName} />
                <ReviewCard label="Bio" value={form.bio} truncate />

                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map(s => (
                      <span key={s} className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <ReviewCard label="Experience" value={EXPERIENCE_LEVELS.find(e => e.value === form.experience)?.label} />
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Categories</p>
                    <p className="text-sm text-gray-700 font-medium">{form.categories.join(', ') || '—'}</p>
                  </div>
                </div>

                {(form.linkedin || form.portfolio) && (
                  <div className="grid grid-cols-2 gap-3">
                    {form.linkedin && <ReviewCard label="LinkedIn" value={`linkedin.com/in/${form.linkedin}`} />}
                    {form.portfolio && <ReviewCard label="Portfolio" value={form.portfolio} />}
                  </div>
                )}

                {photoPreview && (
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                    <img src={photoPreview} alt="Profile" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Profile Photo</p>
                      <p className="text-sm text-gray-700 font-medium mt-0.5">Photo uploaded</p>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mt-2">
                  <p className="text-sm text-blue-700 font-medium">By submitting, you agree to EDUVEX's Tutor Terms of Service and Community Guidelines.</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Nav */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <span className="text-xs text-gray-400 font-medium">Step {step} of {STEPS.length}</span>

            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── helpers ── */
const Req = () => <span className="text-red-400">*</span>;

const StepHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const ReviewCard = ({ label, value, truncate }) => (
  <div className="bg-gray-50 rounded-2xl p-4">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-sm text-gray-700 font-medium ${truncate ? 'line-clamp-2' : ''}`}>{value || '—'}</p>
  </div>
);


export default TutorApplicationForm;