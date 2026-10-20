import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createProduct,
  getCategories,
  getProduct,
  updateProduct,
  uploadProductImage,
} from '../../lib/api';
import { productImage } from '../../lib/products';

const inputClasses =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/20';

const STOCK_OPTIONS = ['In stock', 'Low stock', 'Out of stock', 'Preorder'];

// Mirrors uploadImageMiddleware.js on the server, so a bad file is caught and explained the
// moment it is selected, instead of only after the upload request comes back with an error.
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const emptyForm = { name: '', title: '', category: '', price: '', stock: 'In stock', content: '' };

const AdminProductFormPage = () => {
  const { name: existingName } = useParams();
  const isEditing = Boolean(existingName);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [currentImage, setCurrentImage] = useState(null); // the product's saved image (edit mode)
  const [imageFile, setImageFile] = useState(null); // a newly picked, not-yet-uploaded file
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data))
      .catch((err) => setFormError(err.message));
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    getProduct(existingName)
      .then(({ data }) => {
        setForm({
          name: data.name,
          title: data.title,
          category: data.category?._id ?? '',
          price: String(data.price),
          stock: data.stock,
          content: (data.content ?? []).join('\n'),
        });
        setCurrentImage(productImage(data.image));
      })
      .catch((err) => setFormError(err.message))
      .finally(() => setLoading(false));
  }, [existingName, isEditing]);

  // Revoke the object URL when it is replaced or the page leaves, so it doesn't leak memory.
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setImageError('');
    if (!file) {
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Only JPEG, PNG, or WebP image files are allowed.');
      setImageFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError(`Image must be 5 MB or smaller (this file is ${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      setImageFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleChange = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        category: form.category,
        price: Number(form.price),
        stock: form.stock,
        content: form.content.split('\n').map((line) => line.trim()).filter(Boolean),
      };

      let productName = existingName;
      if (isEditing) {
        await updateProduct(existingName, payload);
      } else {
        const { data } = await createProduct({ name: form.name, ...payload });
        productName = data.name;
      }

      if (imageFile) {
        await uploadProductImage(productName, imageFile);
      }

      navigate('/admin/products');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;

  const displayedImage = previewUrl ?? currentImage;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">{isEditing ? `Edit ${form.title}` : 'New Product'}</h1>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        {formError && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}

        {!isEditing && (
          <div>
            <label htmlFor="product-name" className="text-sm font-semibold text-slate-900">
              URL name (slug)
            </label>
            <input
              id="product-name"
              required
              placeholder="e.g. campus-tote-bag"
              value={form.name}
              onChange={handleChange('name')}
              className={inputClasses}
            />
          </div>
        )}

        <div>
          <label htmlFor="product-title" className="text-sm font-semibold text-slate-900">
            Title
          </label>
          <input id="product-title" required value={form.title} onChange={handleChange('title')} className={inputClasses} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="product-category" className="text-sm font-semibold text-slate-900">
              Category
            </label>
            <select id="product-category" required value={form.category} onChange={handleChange('category')} className={inputClasses}>
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="product-stock" className="text-sm font-semibold text-slate-900">
              Stock
            </label>
            <select id="product-stock" value={form.stock} onChange={handleChange('stock')} className={inputClasses}>
              {STOCK_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="product-price" className="text-sm font-semibold text-slate-900">
            Price (₱)
          </label>
          <input id="product-price" type="number" min="0" step="0.01" required value={form.price} onChange={handleChange('price')} className={inputClasses} />
        </div>

        <div>
          <label htmlFor="product-content" className="text-sm font-semibold text-slate-900">
            Description (one line per paragraph)
          </label>
          <textarea id="product-content" rows={4} value={form.content} onChange={handleChange('content')} className={inputClasses} />
        </div>

        <div>
          <label htmlFor="product-image" className="text-sm font-semibold text-slate-900">
            Product image
          </label>
          <input
            id="product-image"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.2em] file:text-white hover:file:bg-slate-800"
          />
          <p className="mt-1 text-xs text-slate-500">JPEG, PNG, or WebP, up to 5 MB.</p>
          {imageError && <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{imageError}</p>}

          {displayedImage && (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {previewUrl ? 'Preview (not uploaded yet)' : 'Current image'}
              </p>
              <img src={displayedImage} alt="Product preview" className="mt-2 h-40 w-40 rounded-xl border border-slate-200 object-cover" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="rounded-lg bg-slate-100 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
