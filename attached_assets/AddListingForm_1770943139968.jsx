import { useState, useRef, useCallback } from 'react';
import { ChevronDown, ChevronRight, Plus, X, Save, Image, Upload, FolderOpen, Link } from 'lucide-react';


const defaultForm = {
  address: '',
  city: '',
  state: 'CA',
  zip: '',
  price: '',
  status: 'Active',
  is_new_listing: false,
  listing_id: '',
  property_type: 'Residential',
  property_sub_type: 'Single Family Residence',
  beds: '',
  baths_full: '',
  baths_three_quarter: '',
  baths_half: '',
  sqft: '',
  year_built: '',
  lot_size: '',
  levels: 'One',
  garage_spaces: '',
  subdivision: '',
  description: '',
  directions: '',
  parking: '',
  laundry: '',
  cooling: '',
  heating: '',
  fireplace: '',
  patio_porch: '',
  pool: '',
  view_description: '',
  sewer: '',
  eating_area: '',
  appliances: '',
  interior_features: '',
  flooring: '',
  association_fee: '',
  association_fee_frequency: 'Monthly',
  high_school_district: '',
  mls_area: '',
  county: 'Orange',
  special_conditions: '',
  assessments: '',
  tax_annual_amount: '',
  land_lease: '',
  original_price: '',
  listing_agent: '',
  listing_office: '',
  open_house_date: '',
  open_house_time: '',
  photos: [],
};

const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500';

function Section({ title, expanded, onToggle, children }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors text-left"
      >
        {expanded ? <ChevronDown size={20} className="text-gray-600" /> : <ChevronRight size={20} className="text-gray-600" />}
        <span className="font-bold text-gray-800">{title}</span>
      </button>
      {expanded && <div className="p-4">{children}</div>}
    </div>
  );
}

export default function AddListingForm({ listing, onSave, onCancel }) {
  const [form, setForm] = useState(() => {
    if (listing) {
      return { ...defaultForm, ...listing, photos: listing.photos ? [...listing.photos] : [] };
    }
    return { ...defaultForm, photos: [] };
  });

  const [sections, setSections] = useState({
    core: true,
    property: true,
    description: false,
    features: false,
    interior: false,
    additional: false,
    openhouse: false,
    photos: true,
  });

  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const toggle = (key) => setSections((s) => ({ ...s, [key]: !s[key] }));

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form });
  };

  const removePhoto = (i) => setForm((f) => ({ ...f, photos: f.photos.filter((_, idx) => idx !== i) }));

  const uploadFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          formData.append('photos', file);
        }
      });

      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm(f => ({ ...f, photos: [...f.photos, ...data.urls] }));
      } else {
        const errData = await res.json().catch(() => ({}));
        setUploadError('Photo upload is not available right now. Use the "Add URL" option below to paste image links instead.');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError('Photo upload is not available right now. Use the "Add URL" option below to paste image links instead.');
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const files = e.dataTransfer.files;
    uploadFiles(files);
  }, [uploadFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleFileSelect = (e) => {
    uploadFiles(e.target.files);
    e.target.value = '';
  };

  const renderInput = (label, field, type = 'text', opts = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{opts.required && <span className="text-red-500 ml-1">*</span>}</label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => set(field, e.target.value)}
        className={inputClass}
        placeholder={opts.placeholder || ''}
        required={opts.required}
      />
    </div>
  );

  const renderSelect = (label, field, options) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={form[field]}
        onChange={(e) => set(field, e.target.value)}
        className={inputClass}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );

  const renderTextarea = (label, field, rows = 3, opts = {}) => (
    <div className={opts.fullWidth ? 'md:col-span-2 lg:col-span-3' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        rows={rows}
        value={form[field]}
        onChange={(e) => set(field, e.target.value)}
        className={inputClass}
        placeholder={opts.placeholder || ''}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {listing ? 'Edit Listing' : 'Add New Listing'}
      </h2>

      <Section title="Core Information" expanded={sections.core} onToggle={() => toggle('core')}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInput('Address', 'address', 'text', { required: true })}
          {renderInput('City', 'city')}
          {renderInput('State', 'state')}
          {renderInput('Zip', 'zip')}
          {renderInput('Price', 'price', 'number', { required: true })}
          {renderSelect('Status', 'status', ['Active', 'Pending', 'Sold', 'Withdrawn'])}
          {renderInput('MLS Number', 'listing_id')}
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="is_new_listing"
              checked={form.is_new_listing}
              onChange={(e) => set('is_new_listing', e.target.checked)}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="is_new_listing" className="text-sm font-medium text-gray-700">New Listing</label>
          </div>
        </div>
      </Section>

      <Section title="Property Details" expanded={sections.property} onToggle={() => toggle('property')}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderSelect('Property Type', 'property_type', ['Residential', 'Commercial', 'Land'])}
          {renderSelect('Property Sub Type', 'property_sub_type', ['Single Family Residence', 'Stock Cooperative', 'Condominium', 'Townhouse', 'Multi-Family', 'Mobile Home'])}
          {renderInput('Beds', 'beds', 'number')}
          {renderInput('Full Baths', 'baths_full', 'number')}
          {renderInput('Three-Quarter Baths', 'baths_three_quarter', 'number')}
          {renderInput('Half Baths', 'baths_half', 'number')}
          {renderInput('Living Area (sq ft)', 'sqft', 'number')}
          {renderInput('Year Built', 'year_built', 'number')}
          {renderInput('Lot Size', 'lot_size')}
          {renderSelect('Levels', 'levels', ['One', 'Two', 'Three', 'Multi/Split'])}
          {renderInput('Garage Spaces', 'garage_spaces', 'number')}
          {renderInput('Subdivision', 'subdivision')}
        </div>
      </Section>

      <Section title="Description & Directions" expanded={sections.description} onToggle={() => toggle('description')}>
        <div className="grid md:grid-cols-1 gap-4">
          {renderTextarea('Description', 'description', 6)}
          {renderTextarea('Directions', 'directions', 2)}
        </div>
      </Section>

      <Section title="Features" expanded={sections.features} onToggle={() => toggle('features')}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInput('Parking', 'parking', 'text', { placeholder: 'e.g., Community' })}
          {renderInput('Laundry', 'laundry', 'text', { placeholder: 'e.g., Dryer Included, Electric Dryer Hookup, Washer Hookup, Washer Included' })}
          {renderInput('Cooling', 'cooling', 'text', { placeholder: 'e.g., Ductless' })}
          {renderInput('Heating', 'heating')}
          {renderInput('Fireplace', 'fireplace', 'text', { placeholder: 'e.g., None' })}
          {renderInput('Patio/Porch', 'patio_porch', 'text', { placeholder: 'e.g., Patio' })}
          {renderInput('Pool', 'pool')}
          {renderInput('View', 'view_description', 'text', { placeholder: 'e.g., Lake, Mountain(s)' })}
          {renderInput('Sewer', 'sewer', 'text', { placeholder: 'e.g., Public Sewer' })}
        </div>
      </Section>

      <Section title="Interior" expanded={sections.interior} onToggle={() => toggle('interior')}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInput('Eating Area', 'eating_area', 'text', { placeholder: 'e.g., Dining Ell' })}
          {renderInput('Appliances', 'appliances', 'text', { placeholder: 'e.g., Dishwasher, Microwave, Refrigerator' })}
          {renderInput('Interior Features', 'interior_features', 'text', { placeholder: 'e.g., Cathedral Ceiling(s), Open Floorplan' })}
          {renderInput('Flooring', 'flooring')}
        </div>
      </Section>

      <Section title="Additional Information" expanded={sections.additional} onToggle={() => toggle('additional')}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInput('Association Fee', 'association_fee', 'number')}
          {renderSelect('Fee Frequency', 'association_fee_frequency', ['Monthly', 'Quarterly', 'Annually'])}
          {renderInput('High School District', 'high_school_district')}
          {renderInput('MLS Area Major', 'mls_area')}
          {renderInput('County', 'county')}
          {renderInput('Special Conditions', 'special_conditions', 'text', { placeholder: 'e.g., Standard' })}
          {renderInput('Assessments', 'assessments', 'text', { placeholder: 'e.g., Unknown' })}
          {renderInput('Tax Annual Amount', 'tax_annual_amount', 'number')}
          {renderInput('Land Lease', 'land_lease')}
          {renderInput('Original Price', 'original_price', 'number')}
          {renderInput('Listing Agent', 'listing_agent')}
          {renderInput('Listing Office', 'listing_office')}
        </div>
      </Section>

      <Section title="Open House" expanded={sections.openhouse} onToggle={() => toggle('openhouse')}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Open House Date</label>
            <input
              type="date"
              value={form.open_house_date}
              onChange={(e) => set('open_house_date', e.target.value)}
              className={inputClass}
            />
          </div>
          {renderInput('Open House Time', 'open_house_time', 'text', { placeholder: 'e.g., 12:00PM-3:00PM' })}
        </div>
      </Section>

      <Section title="Photos" expanded={sections.photos} onToggle={() => toggle('photos')}>
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragOver
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                <p className="text-primary-600 font-medium">Uploading images...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                  <Upload size={24} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Drag & drop images here</p>
                  <p className="text-gray-400 text-sm mt-1">or click to browse files</p>
                </div>
                <p className="text-gray-400 text-xs">JPG, PNG, GIF, WebP up to 10MB each</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Image size={16} />
              Add Images
            </button>
            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <FolderOpen size={16} />
              Add Folder
            </button>
            <input
              ref={folderInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              {...{ webkitdirectory: '', directory: '' }}
            />
          </div>

          {uploadError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
              {uploadError}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                if (photoUrl.trim()) {
                  setForm(f => ({ ...f, photos: [...f.photos, photoUrl.trim()] }));
                  setPhotoUrl('');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap"
            >
              <Link size={16} />
              Add URL
            </button>
          </div>

          {form.photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {form.photos.map((url, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-100">
                  <img
                    src={url}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = ''; e.target.className = 'w-full h-full bg-gray-200 flex items-center justify-center'; }}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={14} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary-600 text-white text-xs rounded font-medium">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      <div className="flex items-center gap-4 pt-4">
        <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <Save size={18} />
          {uploading ? 'Uploading...' : 'Save Listing'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
