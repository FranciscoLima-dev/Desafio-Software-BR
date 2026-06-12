import {
  DashboardRepository,
  type DashboardSummary,
} from "../repositories/dashboard.repository.js";

export class DashboardService {
  constructor(private readonly dashboardRepository = new DashboardRepository()) {}

  summary(userId: string): Promise<DashboardSummary> {
    return this.dashboardRepository.summaryByUserId(userId);
  }
}
