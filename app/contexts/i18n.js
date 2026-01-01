"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { fetchAllLanguages, fetchTranslations } from "../helper/backend";
import { useFetch } from "../helper/hooks";
const I18nContext = createContext({});
const I18nProvider = ({ children }) => {
  const [languages] = useFetch(fetchAllLanguages)
  const [translations, setTranslations] = useState({})
  const [lang, setLang] = useState()
  const [langCode, setLangCode] = useState()
  const [direction, setDirection] = useState('ltr')

  useEffect(() => {
    if (languages?.length > 0) {
      const lang = localStorage.getItem('lang');
      const langCodeLocal = localStorage.getItem('langCode');
      const isLangIdExist = languages?.some(l => l?._id === lang)
      const isLangCodeExist = languages?.some(l => l?.code === langCodeLocal)
      if (!isLangIdExist) {
        localStorage.removeItem('lang');
      }
      if (!isLangCodeExist) {
        localStorage.removeItem('langCode');
      }
    }
  }, [languages]);

  useEffect(() => {
    const lang = localStorage.getItem('lang')
    if (!!lang && languages?.length > 0) {
      const selectedLang = languages?.find(l => l?._id === lang)
      setLangCode(selectedLang?.code)
      localStorage.setItem('langCode', selectedLang?.code)
      setDirection(selectedLang?.rtl ? 'rtl' : 'ltr')
      setLang(lang)
      fetchTranslations({ _id: lang }).then(({ success, data }) => {
        if (success) {

          setTranslations(data?.translations)
        }
      })
    }
  }, [lang, languages])

  const changeLanguage = (value) => {
    const lang = languages?.find(l => l?._id === value)

    if (lang) {
      setLangCode(lang?.code)
      setLang(value)
      setDirection(lang?.rtl ? 'rtl' : 'ltr')
      localStorage.setItem('lang', value)
    }

  }



  useEffect(() => {
    if (languages?.length > 0) {
      languages?.forEach(lang => {
        if (!!lang?.default) {
          setLang(lang?._id)
          setLangCode(lang?.code)
        }
        // setDirection(lang?.rtl ? 'rtl' : 'ltr')
      })
    }
  }, [languages])

  useEffect(() => {
    document.documentElement.dir = direction
  }, [direction])


  // const t = (key) => translations?.[key] || key

  const t = (key) => {
    if (!!key && languages?.length > 0) {
      let langKeys = localStorage.getItem('lang_keys')
      let data = !!langKeys ? JSON.parse(langKeys) : {}
      data[key] = ''
      localStorage.setItem('lang_keys', JSON.stringify(data))
    }
    return translations?.[key] || key
  }

  return (
    <I18nContext.Provider value={{ languages, lang, setLang, t, changeLanguage, direction, langCode }}>
      {children}
    </I18nContext.Provider>
  )
}

export default I18nProvider
export const useI18n = () => useContext(I18nContext)
