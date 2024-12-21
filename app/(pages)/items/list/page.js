'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';

import { classNames } from 'primereact/utils';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield'
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox'

import LoadingScreen from "@/app/ui/molecules/LoadingScreen";
import Apis from '@/app/libs/apis';

const PageItemCrud = () => {
  const cookies = new Cookies
  const [thisUser, setThisUser] = useState({})
  const router = useRouter()
  
  const [items, setItems] = useState(null)
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tipo: { value: null, matchMode: FilterMatchMode.EQUALS }
  })
  const [loading, setLoading] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [tipos, setTipos] = useState([])

  const onGlobalFilterChange = e => {
    const value = e.target.value
    let _filters = {...filters}
    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const renderHeader = () => {
    return (
      <div className='flex justify-end'> 
        <IconField iconPosition='left'>
          <InputIcon className='pi pi-search' />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder='Búsqueda' />
        </IconField>
      </div>
    )
  }

  const itemBodyTemplate = (rowData) => {
    return (
      <Link
        href={`./${rowData.uid}`}
      >
        {rowData.nombre}
      </Link>
    )
  }

  const typesBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.tipo}
      />
    )
  }

  const typesItemTemplate = (option) => {
    return (
      <Tag
        value={option}
      />
    )
  }

  const typesRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={tipos}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={typesItemTemplate}
        placeholder='Filtrar por tipo'
        className='p-column-filter'
        showClear
      />
    )
  }

  const header = renderHeader()

  useEffect(() => {
    setLoading(true)
    const getUser = () => {
      const user = cookies.get('xochitl-user')
      if ( user ) setThisUser(user)
    }
    const getMenuTypes = () => {
      Apis.menu.GetMenuTypes((types) => {
        setTipos(types)
      })
    }
    const getItems = () => {
      Apis.menu.GetMenues((items) => {
        setItems(items)
      })
    }
    getUser()
    getMenuTypes()
    getItems()
  }, [])

  return (
    <div className='pt-6'>
      <div className='mx-auto my-0 w-11/12'>
        {thisUser.rol == 'Admin' && (
          <>
            <div className="flex items-start justify-center mb-20 w-full">
              <DataTable
                value={items}
                paginator
                rows={14}
                dataKey='nombre'
                filters={filters}
                filterDisplay='row'
                globalFilterFields={[
                  'nombre',
                  'descripcion',
                  'precio',
                  'tipo'
                ]}
                header={header}
                rowsPerPageOptions={[
                  14, 21, 28, 35
                ]}
                emptyMessage="No se han encontrado items del menú"
              >
                <Column
                  field='nombre'
                  body={itemBodyTemplate}
                  header='Nombre'
                  filter
                  filterPlaceholder='Buscar por nombre'
                />
                <Column
                  field='descripcion'
                  header='Descripcion'
                  filter
                  filterPlaceholder='Buscar por descripción'
                />
                <Column
                  field='precio'
                  header='Precio'
                  filter
                  filterPlaceholder='Buscar por precio'
                />
                <Column
                  field='tipo'
                  header='Tipo'
                  showFilterMenu={false}
                  body={typesBodyTemplate}
                  filter
                  filterElement={typesRowFilterTemplate}
                />
              </DataTable>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PageItemCrud