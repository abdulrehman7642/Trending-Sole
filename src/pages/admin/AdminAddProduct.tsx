import { supabase } from '../../lib/supabase';
import { ChangeEvent, useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminAddProduct() {
  const { navigate, showToast, pageParams, products, refreshCatalog } = useApp();
  const existing = products.find((p) => p.id === pageParams.id);
  const isEdit = Boolean(pageParams.id);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: existing?.name || '',
    sku: existing?.sku || '',
    category: (existing?.category || 'men') as string,
    subCategory: (existing?.subCategory || 'sneakers') as string,
    price: existing ? String(existing.price) : '',
    salePrice: existing?.salePrice != null ? String(existing.salePrice) : '',
    stock: existing ? String(existing.stock) : '',
    description: existing?.description || '',
    material: existing?.material || '',
    isNew: existing?.isNew || false,
    isFeatured: existing?.isFeatured || false,
  });

  const [sizes, setSizes] = useState<string[]>(existing?.sizes || []);
  const [newSize, setNewSize] = useState('');
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(existing?.colors || []);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [images, setImages] = useState<string[]>(existing?.images || []);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const uploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length || uploading) return;
    const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
    if (files.some(file => !extensions[file.type] || file.size === 0 || file.size > 10 * 1024 * 1024)) {
      setUploadMessage('Choose JPG, PNG, WebP or GIF images up to 10 MB each.');
      return;
    }
    setUploading(true);
    setUploadMessage('Uploading images?');
    let uploaded = 0;
    try {
      for (const file of files) {
        const path = `${crypto.randomUUID()}.${extensions[file.type]}`;
        const { error } = await supabase.storage.from('product-images').upload(path, file, { contentType: file.type, upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        setImages(previous => [...previous.filter(url => url.trim()), data.publicUrl]);
        uploaded += 1;
      }
      setUploadMessage(`${uploaded} ${uploaded === 1 ? 'image uploaded' : 'images uploaded'}. Save the product to use them.`);
    } catch {
      setUploadMessage(uploaded ? `${uploaded} uploaded. Some images could not be uploaded; please try again.` : 'Upload failed. Please try again.');
    } finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (uploading || saving) return;
    if (isEdit && !existing) { showToast('Product not found.', 'error'); return; }
    if (!form.name.trim() || !form.sku.trim() || form.price === '' || Number(form.price) < 0 || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0 || !sizes.length || !colors.length || !images.some((url) => url.trim())) {
      showToast('Enter a name, SKU, valid price and stock, at least one size, color and image URL.', 'error'); return;
    }
    if (form.salePrice && (Number(form.salePrice) < 0 || Number(form.salePrice) > Number(form.price))) { showToast('Sale price must be between zero and the regular price.', 'error'); return; }
    const slug = existing?.slug || `${form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${crypto.randomUUID().slice(0, 8)}`;
    const values = { name: form.name.trim(), sku: form.sku.trim(), slug, category: form.category, sub_category: form.subCategory, price: Number(form.price), sale_price: form.salePrice === '' ? null : Number(form.salePrice), stock: Number(form.stock), description: form.description, material: form.material, is_new: form.isNew, is_featured: form.isFeatured, sizes, colors, images: images.map((url) => url.trim()).filter(Boolean) };
    setSaving(true);
    const query = isEdit ? supabase.from('products').update(values).eq('id', pageParams.id) : supabase.from('products').insert(values);
    const { data, error } = await query.select('id');
    setSaving(false);
    if (error || !data?.length) { showToast(error?.message || 'Product could not be saved.', 'error'); return; }
    await refreshCatalog();
    showToast(isEdit ? 'Product updated.' : 'Product published.', 'success');
    navigate('admin-products');
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  const addColor = () => {
    if (newColorName) {
      setColors([...colors, { name: newColorName, hex: newColorHex }]);
      setNewColorName('');
    }
  };

  const inputClass = "w-full border border-border rounded-sm px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors font-sans bg-ivory";
  const labelClass = "text-xs tracking-widest uppercase font-semibold text-primary block mb-2";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-xs text-muted mt-0.5">{isEdit ? 'Update product details' : 'Fill in the details below to publish a new product'}</p>
        </div>
        <button onClick={() => navigate('admin-products')} className="text-xs text-muted hover:text-primary flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic info */}
          <div className="bg-card border border-border rounded-sm p-5 space-y-4">
            <h3 className="font-serif text-lg text-primary border-b border-border pb-3">Basic Information</h3>
            <div>
              <label className={labelClass}>Product Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. Meridian Leather Oxford" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>SKU</label>
                <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className={inputClass} placeholder="ZV-MN-OXF-001" />
              </div>
              <div>
                <label className={labelClass}>Stock Quantity</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputClass} placeholder="0" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} min-h-24 resize-y`}
                placeholder="Describe the product…"
              />
            </div>
            <div>
              <label className={labelClass}>Material & Care</label>
              <textarea
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                className={`${inputClass} min-h-16 resize-y`}
                placeholder="e.g. Full-grain calfskin leather upper, rubber outsole"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-card border border-border rounded-sm p-5 space-y-4">
            <h3 className="font-serif text-lg text-primary border-b border-border pb-3">Pricing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Regular Price (AED)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} placeholder="150" />
              </div>
              <div>
                <label className={labelClass}>Sale Price (AED) <span className="text-muted normal-case font-normal">(optional)</span></label>
                <input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} className={inputClass} placeholder="Leave blank if no sale" />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-card border border-border rounded-sm p-5 space-y-5">
            <h3 className="font-serif text-lg text-primary border-b border-border pb-3">Sizes & Colors</h3>

            {/* Sizes */}
            <div>
              <label className={labelClass}>Sizes</label>
              <div className="flex gap-2 mb-3">
                <input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="e.g. 42"
                  className="flex-1 min-w-0 border border-border rounded-sm px-3 py-2 text-sm outline-none focus:border-primary bg-ivory font-sans"
                  onKeyDown={(e) => e.key === 'Enter' && addSize()}
                />
                <button onClick={addSize} className="bg-primary text-ivory text-xs px-4 py-2 rounded-sm hover:bg-slate transition-colors">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-sm">
                    {s}
                    <button onClick={() => setSizes(sizes.filter((x) => x !== s))} className="text-muted hover:text-terracotta">×</button>
                  </span>
                ))}
                {sizes.length === 0 && <p className="text-xs text-muted">No sizes added yet</p>}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className={labelClass}>Colors</label>
              <div className="flex gap-2 mb-3">
                <input
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Color name (e.g. Midnight Black)"
                  className="flex-1 min-w-0 border border-border rounded-sm px-3 py-2 text-sm outline-none focus:border-primary bg-ivory font-sans"
                />
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-10 h-10 border border-border rounded-sm cursor-pointer p-0.5 bg-ivory"
                />
                <button onClick={addColor} className="bg-primary text-ivory text-xs px-4 py-2 rounded-sm hover:bg-slate transition-colors">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <span key={c.name} className="flex items-center gap-2 border border-border text-xs px-2.5 py-1 rounded-sm">
                    <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                    {c.name}
                    <button onClick={() => setColors(colors.filter((x) => x.name !== c.name))} className="text-muted hover:text-terracotta">×</button>
                  </span>
                ))}
                {colors.length === 0 && <p className="text-xs text-muted">No colors added yet</p>}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-card border border-border rounded-sm p-5">
            <h3 className="font-serif text-lg text-primary border-b border-border pb-3 mb-4">Product Images</h3>
            <label className={labelClass} htmlFor="product-image-files">Upload from your device</label>
            <input id="product-image-files" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple disabled={uploading || saving} onChange={uploadImages} className="block w-full text-sm text-slate file:mr-4 file:border-0 file:bg-primary file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-ivory file:cursor-pointer disabled:opacity-50" />
            <p className="mt-2 text-xs text-muted">JPG, PNG, WebP or GIF, up to 10 MB per image.</p>
            {uploadMessage && <p role="status" className="mt-2 text-xs text-slate">{uploadMessage}</p>}
            <label className={`${labelClass} mt-5`} htmlFor="image-urls">Image URLs (one per line)</label>
            <textarea id="image-urls" value={images.join('\n')} onChange={(e) => setImages(e.target.value.split('\n'))} className={`${inputClass} min-h-24`} placeholder="https://example.com/shoe.jpg" />

          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Category */}
          <div className="bg-card border border-border rounded-sm p-5 space-y-4">
            <h3 className="font-serif text-lg text-primary border-b border-border pb-3">Organization</h3>
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Sub-Category</label>
              <select value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value })} className={inputClass}>
                {['sneakers', 'formal', 'casual', 'sandals', 'boots', 'sports'].map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-card border border-border rounded-sm p-5 space-y-3">
            <h3 className="font-serif text-lg text-primary border-b border-border pb-3">Visibility</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate">Mark as New Arrival</span>
              <button
                onClick={() => setForm({ ...form, isNew: !form.isNew })}
                className={`w-10 h-5 rounded-full transition-colors ${form.isNew ? 'bg-primary' : 'bg-border'} relative`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isNew ? 'left-5' : 'left-0.5'}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate">Feature on Homepage</span>
              <button
                onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
                className={`w-10 h-5 rounded-full transition-colors ${form.isFeatured ? 'bg-primary' : 'bg-border'} relative`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isFeatured ? 'left-5' : 'left-0.5'}`} />
              </button>
            </label>
          </div>

          {/* Actions */}
          <div className="bg-card border border-border rounded-sm p-5 space-y-3">
            <button disabled={saving || uploading} onClick={handleSave} className="w-full bg-primary text-ivory text-xs tracking-widest uppercase py-3 font-semibold hover:bg-slate transition-colors rounded-sm">
              {isEdit ? 'Update Product' : 'Publish Product'}
            </button>
            <button
              onClick={() => navigate('admin-products')}
              className="w-full border border-border text-slate text-xs tracking-widest uppercase py-3 rounded-sm hover:border-primary hover:text-primary transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
