// eslint-disable-next-line @masknet/no-top-level
'use client'

import type { SharedProps } from 'fumadocs-ui/components/dialog/search'

import { create } from '@orama/orama'
import { useDocsSearch } from 'fumadocs-core/search/client'
import {
  SearchDialog as DefaultSearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,

} from 'fumadocs-ui/components/dialog/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'

const initOrama = () => create({
  // https://docs.orama.com/open-source/supported-languages
  language: 'english',
  schema: { _: 'string' },
})

export const SearchDialog = (props: SharedProps) => {
  const { locale } = useI18n() // (optional) for i18n
  const { query, search, setSearch } = useDocsSearch({
    initOrama,
    locale,
    type: 'static',
  })

  return (
    <DefaultSearchDialog
      isLoading={query.isLoading}
      onSearchChange={setSearch}
      search={search}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        {/* eslint-disable-next-line @masknet/jsx-no-logical */}
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
      </SearchDialogContent>
    </DefaultSearchDialog>
  )
}
