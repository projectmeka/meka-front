import storage from 'utils/storage'

export const getInitialLang = () => ({
  locale: storage.getItemSync('lang') || 'en'
})
