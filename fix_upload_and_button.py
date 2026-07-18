import re

with open('src/pages/Upload.jsx', 'r') as f:
    content = f.read()

# 1. Fix handleFileSelect - remove alert, add disabled state to upload area instead
old_upload_check = """  const handleFileSelect = useCallback(async (e) => {
    if (!seller) {
      alert('Please wait, initializing...')
      return
    }

    const files = Array.from(e.target.files)"""

new_upload_check = """  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files)"""

content = content.replace(old_upload_check, new_upload_check)

# 2. Fix upload area - disable when seller not loaded, show professional message
old_upload_label = """        <label className={`block w-full border-2 border-dashed rounded-xl p-8 text-center transition ${
          isAtLimit
            ? 'border-stone-300 bg-stone-50 opacity-50 cursor-not-allowed'
            : 'border-copper-300 hover:border-copper-500 hover:bg-copper-50/50 cursor-pointer'
        }`}>
          <UploadIcon className={`w-8 h-8 mx-auto mb-3 ${isAtLimit ? 'text-stone-400' : 'text-copper-500'}`} strokeWidth={1.5} />
          <p className={`font-medium text-sm ${isAtLimit ? 'text-stone-500' : 'text-charcoal-900'}`}>
            {isAtLimit ? 'Item limit reached' : 'Tap to upload photos'}
          </p>
          <p className="text-charcoal-400 text-xs mt-1">
            {isAtLimit ? 'Upgrade for unlimited items' : `Up to ${remainingSlots} more images`}
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>"""

new_upload_label = """        <label className={`block w-full border-2 border-dashed rounded-xl p-8 text-center transition ${
          !seller || isAtLimit
            ? 'border-stone-300 bg-stone-50 opacity-50 cursor-not-allowed'
            : 'border-copper-300 hover:border-copper-500 hover:bg-copper-50/50 cursor-pointer'
        }`}>
          <UploadIcon className={`w-8 h-8 mx-auto mb-3 ${!seller || isAtLimit ? 'text-stone-400' : 'text-copper-500'}`} strokeWidth={1.5} />
          <p className={`font-medium text-sm ${!seller || isAtLimit ? 'text-stone-500' : 'text-charcoal-900'}`}>
            {!seller ? 'Setting up your shop...' : isAtLimit ? 'Item limit reached' : 'Tap to upload photos'}
          </p>
          <p className="text-charcoal-400 text-xs mt-1">
            {!seller ? 'Please wait a moment' : isAtLimit ? 'Upgrade for unlimited items' : `Up to ${remainingSlots} more images`}
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={!seller || isAtLimit}
            className="hidden"
          />
        </label>"""

content = content.replace(old_upload_label, new_upload_label)

# 3. Fix Save button - stay "Saved" until fields change
# Add state to track if fields have changed since last save
old_states = """  const [phoneSaved, setPhoneSaved] = useState(false)
  const [seller, setSeller] = useState(null)"""

new_states = """  const [phoneSaved, setPhoneSaved] = useState(false)
  const [seller, setSeller] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)"""

content = content.replace(old_states, new_states)

# 4. Update shopName and localPhone onChange to set hasUnsavedChanges
old_shopname_change = 'onChange={(e) => setShopName(e.target.value)}'
new_shopname_change = 'onChange={(e) => { setShopName(e.target.value); setHasUnsavedChanges(true); setPhoneSaved(false); }}'

content = content.replace(old_shopname_change, new_shopname_change)

old_phone_change = "onChange={(e) => { setLocalPhone(e.target.value); setPhoneTouched(true); }}"
new_phone_change = "onChange={(e) => { setLocalPhone(e.target.value); setPhoneTouched(true); setHasUnsavedChanges(true); setPhoneSaved(false); }}"

content = content.replace(old_phone_change, new_phone_change)

old_country_change = "onChange={(e) => { setSelectedCountry(e.target.value); setLocalPhone(''); }}"
new_country_change = "onChange={(e) => { setSelectedCountry(e.target.value); setLocalPhone(''); setHasUnsavedChanges(true); setPhoneSaved(false); }}"

content = content.replace(old_country_change, new_country_change)

# 5. Update saveSellerInfo to set hasUnsavedChanges false
old_save_end = """    setPhoneSaved(true)
    setTimeout(() => setPhoneSaved(false), 2000)
  }"""

new_save_end = """    setPhoneSaved(true)
    setHasUnsavedChanges(false)
  }"""

content = content.replace(old_save_end, new_save_end)

# 6. Update button text to show "Saved" when saved and no unsaved changes
old_button_text = """          <button
            onClick={saveSellerInfo}
            disabled={!canSave}
            className="w-full bg-charcoal-950 text-white py-3 rounded-xl font-medium hover:bg-charcoal-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {phoneSaved ? (
              <>
                <Check className="w-4 h-4" strokeWidth={3} />
                Saved
              </>
            ) : (
              'Save Shop Details'
            )}
          </button>"""

new_button_text = """          <button
            onClick={saveSellerInfo}
            disabled={!canSave}
            className="w-full bg-charcoal-950 text-white py-3 rounded-xl font-medium hover:bg-charcoal-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {phoneSaved && !hasUnsavedChanges ? (
              <>
                <Check className="w-4 h-4" strokeWidth={3} />
                Shop Details Saved
              </>
            ) : (
              'Save Shop Details'
            )}
          </button>"""

content = content.replace(old_button_text, new_button_text)

with open('src/pages/Upload.jsx', 'w') as f:
    f.write(content)

print('Upload and button fixes applied')
