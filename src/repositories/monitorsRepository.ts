import { Prisma, Monitor } from '@prisma/client'

export interface MonitorsRepository {
  create(newMonitor: Prisma.MonitorCreateInput): Promise<Monitor | null>
  delete(id: string): Promise<void>
  update(
    id: string,
    newMonitor: Prisma.MonitorUpdateInput,
  ): Promise<Monitor | null>
  findById(id: string): Promise<Monitor | null>
  findActives(): Promise<Monitor[]>
  getMonitors({
    page,
  }: {
    page?: number
  }): Promise<{ monitors: Monitor[]; totalCount: number; pageQty: number }>
  monitorExists({
    type,
    symbol,
    interval,
  }: {
    type: string
    symbol: string
    interval: string
  }): Promise<number>
}
