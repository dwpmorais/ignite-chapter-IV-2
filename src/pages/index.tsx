import { Button, Box } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'

import { Header } from '../components/Header'
import { CardList } from '../components/CardList'
import { api } from '../services/api'
import { Loading } from '../components/Loading'
import { Error } from '../components/Error'

interface Card {
  description: string,
  id: string,
  title: string,
  ts: number,
  url: string
}

export default function Home (): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM
    // ({ pageParam = 0 }) => fetch('/api/images?after=' + pageParam)

    ({ pageParam = 0 }) => api.get(`/api/images`, {
      params: {
        after: pageParam,
      },
    }).then(response => response.data)
    ,
    // TODO GET AND RETURN NEXT PAGE PARAM
    { getNextPageParam: (lastPage) => lastPage.after ?? null },
  )

  const formattedData: Card[] = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    return data?.pages.flatMap((val) => {return val.data})

  }, [data])

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return (<Loading/>)
  }
  // TODO RENDER ERROR SCREEN
  if (isError) {
    return (<Error/>)
  }

  return (
    <>

      <>
        <Header/>
        <Box maxW={1120} px={20} mx="auto" my={20}>
          <CardList cards={formattedData} />
          {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
          {hasNextPage ? (
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage ? ('carregando') : 'Carregar mais'}
            </Button>
          ) : (false)}
        </Box>
      </>

    </>
  )
}

