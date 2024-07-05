export const Produto = [
  {
    name: 'name',
    type: 'text'
  },
  {
    name: 'description',
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
