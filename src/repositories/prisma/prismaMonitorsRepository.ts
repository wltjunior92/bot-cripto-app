import { Prisma, Monitor } from '@prisma/client'
import { MonitorsRepository } from '../monitorsRepository'
import { prisma } from '@/lib/prisma'
import { MonitorAlreadyExistsError } from '@/errors/monitorAlreadyExistsError'

export class PrismaMonitorsRepository implements MonitorsRepository {
  async create(newMonitor: Prisma.MonitorCreateInput): Promise<Monitor | null> {
    const monitorExists = await this.monitorExists({
      type: newMonitor.type,
      symbol: newMonitor.symbol as string,
      interval: newMonitor.interval as string,
    })
    if (monitorExists) throw new MonitorAlreadyExistsError()
    const monitor = await prisma.monitor.create({ data: newMonitor })

    return monitor
  }

  async delete(id: string): Promise<void> {
    await prisma.monitor.delete({ where: { id } })
  }

  async update(
    id: string,
    newMonitor: Prisma.MonitorUpdateInput,
  ): Promise<Monitor | null> {
    const monitor = await prisma.monitor.update({
      where: { id },
      data: newMonitor,
    })

    return monitor
  }

  async findById(id: string): Promise<Monitor | null> {
    const monitor = await prisma.monitor.findUnique({ where: { id } })

    return monitor
  }

  async findActives(): Promise<Monitor[]> {
    const monitors = await prisma.monitor.findMany({
      where: { is_active: true },
    })

    return monitors
  }

  async getMonitors({
    page = 1,
  }: {
    page?: number | undefined
  }): Promise<{ monitors: Monitor[]; totalCount: number; pageQty: number }> {
    const pageQty = 10
    const options: Prisma.MonitorFindManyArgs = {
      orderBy: [
        {
          is_active: 'desc',
        },
        {
          is_system_mon: 'desc',
        },
        {
          symbol: 'asc',
        },
      ],
      take: pageQty,
      skip: pageQty * (page - 1),
    }

    const [totalCount, monitors] = await prisma.$transaction([
      prisma.monitor.count(),
      prisma.monitor.findMany(options),
    ])

    return {
      monitors,
      totalCount,
      pageQty,
    }
  }

  async monitorExists({
    type,
    symbol,
    interval,
  }: {
    type: string
    symbol: string
    interval: string
  }): Promise<number> {
    const count = await prisma.monitor.count({
      where: {
        type,
        symbol,
        interval,
      },
    })

    return count
  }
}
