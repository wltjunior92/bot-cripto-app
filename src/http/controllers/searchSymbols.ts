import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeSearchSymbolsService } from '@/services/factories/makeSearchSymbolsService'

export async function searchSymbols(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getSymbolsQuerySchema = z.object({
    search: z.string().optional(),
    onlyFavorites: z.string().optional(),
    page: z.string().optional(),
  })

  const {
    search: searchTerm,
    onlyFavorites: favorites,
    page: searchPage,
  } = getSymbolsQuerySchema.parse(request.query)

  const search = searchTerm ? searchTerm.toUpperCase() : undefined
  const onlyFavorites = !!favorites
  const page = searchPage ? parseInt(searchPage) : undefined
  const searchSymbolsService = makeSearchSymbolsService()

  const {
    symbols,
    totalCount: count,
    pageQty,
  } = await searchSymbolsService.execute({
    search,
    onlyFavorites,
    page,
  })

  return reply.status(200).send({
    symbols,
    count,
    page_qty: pageQty,
  })
}
