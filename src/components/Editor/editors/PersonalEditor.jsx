import React, { useRef, useState } from 'react';
import { Upload, Trash2, User, Loader2 } from 'lucide-react';
import { TextField } from '../../UI/FormElements';
import { fileToResizedDataUrl } from '../../../utils/image';
import { sanitizeUrl } from '../../../utils/safeUrl';

const urlProblem = (value) =>
  value.trim() && !sanitizeUrl(value) ? 'Only web links (http or https) are shown on your resume.' : '';

const PersonalEditor = ({ data, setData }) => {
  const fileInputRef = useRef(null);
  const [photoError, setPhotoError] = useState('');
  const [busy, setBusy] = useState(false);
  const { personal } = data;

  const setField = (name) => (e) =>
    setData((prev) => ({ ...prev, personal: { ...prev.personal, [name]: e.target.value } }));

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // let the same file be picked again
    if (!file) return;
    setBusy(true);
    setPhotoError('');
    try {
      const photoUrl = await fileToResizedDataUrl(file);
      setData((prev) => ({ ...prev, personal: { ...prev.personal, photoUrl } }));
    } catch (error) {
      setPhotoError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const removePhoto = () => {
    setPhotoError('');
    setData((prev) => ({ ...prev, personal: { ...prev.personal, photoUrl: '' } }));
  };

  return (
    <div className="space-y-5">
      <div className="card flex items-center gap-4 p-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-sunken text-ink-3">
          {personal.photoUrl ? (
            <img src={personal.photoUrl} alt="Your profile photo" className="h-full w-full object-cover" />
          ) : (
            <User size={24} />
          )}
        </div>
        <div className="min-w-0">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" aria-label="Upload profile photo" />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current?.click()} disabled={busy}>
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {personal.photoUrl ? 'Replace' : 'Upload photo'}
            </button>
            {personal.photoUrl && (
              <button type="button" className="btn btn-ghost btn-danger btn-sm" onClick={removePhoto}>
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>
          <p className={`mt-2 text-xs ${photoError ? 'text-danger' : 'text-ink-3'}`} role={photoError ? 'alert' : undefined}>
            {photoError || 'Resized automatically. Shown only in templates with a photo.'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <TextField label="Full name" value={personal.name} onChange={setField('name')} autoComplete="name" placeholder="Priya Raman" />
        <TextField label="Headline" value={personal.title} onChange={setField('title')} placeholder="Product designer | Design systems" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Email" type="email" value={personal.email} onChange={setField('email')} autoComplete="email" placeholder="priya@example.com" />
          <TextField label="Phone" type="tel" value={personal.phone} onChange={setField('phone')} autoComplete="tel" placeholder="+91 98765 43210" />
        </div>
        <TextField label="Location" value={personal.location} onChange={setField('location')} autoComplete="address-level2" placeholder="Pune, India" />
        <TextField
          label="LinkedIn"
          value={personal.linkedin}
          onChange={setField('linkedin')}
          inputMode="url"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="linkedin.com/in/priya-raman"
          error={urlProblem(personal.linkedin)}
        />
        <TextField
          label="Portfolio or website"
          value={personal.portfolio}
          onChange={setField('portfolio')}
          inputMode="url"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="priya.design"
          error={urlProblem(personal.portfolio)}
        />
      </div>
    </div>
  );
};

export default PersonalEditor;
