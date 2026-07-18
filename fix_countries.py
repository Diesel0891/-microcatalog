import re

with open('src/pages/Upload.jsx', 'r') as f:
    content = f.read()

old_countries = """const COUNTRIES = [
  { code: 'MW', flag: '🇲🇼', name: 'Malawi', dial: '+265', placeholder: '0991 234 567', regex: /^\\d{9}$/ },
  { code: 'ZM', flag: '🇿🇲', name: 'Zambia', dial: '+260', placeholder: '0977 123 456', regex: /^\\d{9}$/ },
  { code: 'ZW', flag: '🇿🇼', name: 'Zimbabwe', dial: '+263', placeholder: '071 234 5678', regex: /^\\d{9}$/ },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa', dial: '+27', placeholder: '071 234 5678', regex: /^\\d{9}$/ },
  { code: 'TZ', flag: '🇹🇿', name: 'Tanzania', dial: '+255', placeholder: '0712 345 678', regex: /^\\d{9}$/ },
  { code: 'MZ', flag: '🇲🇿', name: 'Mozambique', dial: '+258', placeholder: '84 123 4567', regex: /^\\d{8,9}$/ },
  { code: 'BW', flag: '🇧🇼', name: 'Botswana', dial: '+267', placeholder: '71 123 456', regex: /^\\d{8}$/ },
  { code: 'OTHER', flag: '🌍', name: 'Other', dial: '+', placeholder: 'Full international number', regex: /^\\d{7,15}$/ },
]"""

new_countries = """const COUNTRIES = [
  { code: 'MW', flag: '🇲🇼', name: 'Malawi', dial: '+265', placeholder: '0991 234 567', digits: 9, stripLeadingZero: true },
  { code: 'ZM', flag: '🇿🇲', name: 'Zambia', dial: '+260', placeholder: '0977 123 456', digits: 9, stripLeadingZero: true },
  { code: 'ZW', flag: '🇿🇼', name: 'Zimbabwe', dial: '+263', placeholder: '071 234 5678', digits: 9, stripLeadingZero: true },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa', dial: '+27', placeholder: '071 234 5678', digits: 9, stripLeadingZero: true },
  { code: 'TZ', flag: '🇹🇿', name: 'Tanzania', dial: '+255', placeholder: '0712 345 678', digits: 9, stripLeadingZero: true },
  { code: 'MZ', flag: '🇲🇿', name: 'Mozambique', dial: '+258', placeholder: '84 123 4567', digits: 8, stripLeadingZero: false },
  { code: 'BW', flag: '🇧🇼', name: 'Botswana', dial: '+267', placeholder: '71 123 456', digits: 8, stripLeadingZero: false },
  { code: 'OTHER', flag: '🌍', name: 'Other', dial: '+', placeholder: 'e.g. +447123456789', digits: 7, stripLeadingZero: false },
]"""

content = content.replace(old_countries, new_countries)

old_getfull = """  const getFullPhone = () => {
    const country = COUNTRIES.find(c => c.code === selectedCountry)
    if (!country) return ''
    if (country.code === 'OTHER') {
      const cleaned = localPhone.replace(/\\s/g, '')
      return cleaned.startsWith('+') ? cleaned : '+' + cleaned
    }
    const cleaned = localPhone.replace(/\\D/g, '')
    return country.dial + cleaned
  }"""

new_getfull = """  const getFullPhone = () => {
    const country = COUNTRIES.find(c => c.code === selectedCountry)
    if (!country) return ''
    if (country.code === 'OTHER') {
      const cleaned = localPhone.replace(/\\s/g, '')
      return cleaned.startsWith('+') ? cleaned : '+' + cleaned
    }
    let cleaned = localPhone.replace(/\\D/g, '')
    if (country.stripLeadingZero && cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1)
    }
    return country.dial + cleaned
  }"""

content = content.replace(old_getfull, new_getfull)

old_validate_local = """  const validateLocalPhone = () => {
    const country = COUNTRIES.find(c => c.code === selectedCountry)
    if (!country) return false
    const cleaned = localPhone.replace(/\\D/g, '')
    return country.regex.test(cleaned)
  }"""

new_validate_local = """  const validateLocalPhone = () => {
    const country = COUNTRIES.find(c => c.code === selectedCountry)
    if (!country) return false
    let cleaned = localPhone.replace(/\\D/g, '')
    if (country.stripLeadingZero && cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1)
    }
    return cleaned.length === country.digits
  }"""

content = content.replace(old_validate_local, new_validate_local)

old_ui = """            <div className="flex gap-2">
              <select
                value={selectedCountry}
                onChange={(e) => { setSelectedCountry(e.target.value); setLocalPhone(''); }}
                className="border border-stone-200 rounded-lg px-2 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-copper-400 focus:border-transparent shrink-0"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>"""

new_ui = """            <div className="flex gap-2 max-w-full">
              <select
                value={selectedCountry}
                onChange={(e) => { setSelectedCountry(e.target.value); setLocalPhone(''); }}
                className="border border-stone-200 rounded-lg px-2 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-copper-400 focus:border-transparent shrink-0 max-w-[40%]"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>"""

content = content.replace(old_ui, new_ui)

with open('src/pages/Upload.jsx', 'w') as f:
    f.write(content)

print('Country fixes applied')
