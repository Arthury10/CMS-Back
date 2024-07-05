export const Produto = {
  slug: 'Produto',
  fields: [
    {
      name: 'name',
      type: 'text'
    },
    {
      name: 'descriptionssssssssss',
      type: 'text'
    },
    {
      name: 'publishAt',
      type: 'date'
    },
    {
      tabs: [
        {
          fields: [
            {
              name: 'valor',
              type: 'email'
            }
          ],
          label: 'Text'
        }
      ],
      type: 'tabs'
    }
  ]
}
