const formatSlug = (slug: string) => {
  return slug
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()
}

export default formatSlug
