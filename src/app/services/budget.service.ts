import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Budget {
  id: number;
  budgetUtilized: number;
  budgetAllocated: number;
  sponsorshipTotal: number;
  effectiveAllocated: number;
  preparedBy: string;
  eventId: number;
  eventName: string;
  createdAt: string;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiUrl = 'http://172.10.8.61:8080/sports-backend-0.0.1-SNAPSHOT/api/budget';

  constructor(private http: HttpClient) {}

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl);
  }

  updateBudget(id: number, updatedBudget: Partial<Budget>): Observable<Budget> {
    const url = `${this.apiUrl}/${id}`;
    
    // Convert numbers to proper format
    const formattedBudget = {
      budgetAllocated: Number(updatedBudget.budgetAllocated).toFixed(2),
      budgetUtilized: Number(updatedBudget.budgetUtilized).toFixed(2),
      preparedBy: updatedBudget.preparedBy
    };
    
    console.log('Sending update request to:', url, formattedBudget);
    return this.http.put<Budget>(url, formattedBudget);
  }



  deleteBudget(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  checkEventExists(eventId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-event/${eventId}`);
  }

  createBudget(budget: Partial<Budget>): Observable<Budget> {
    const formattedBudget = {
        budgetAllocated: Number(budget.budgetAllocated).toFixed(2),
        budgetUtilized: Number(budget.budgetUtilized || 0).toFixed(2),
        sponsorshipTotal: Number(budget.sponsorshipTotal || 0).toFixed(2),
        eventId: budget.eventId,
        eventName: budget.eventName,
        preparedBy: budget.preparedBy
    };
    
    return this.http.post<Budget>(this.apiUrl, formattedBudget);
}
}
