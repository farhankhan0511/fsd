// dashboard.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProfileService } from '../../profiles/services/profile.service';
import { Router } from '@angular/router';
import { BudgetService, Budget } from '../../services/budget.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  createProfileButton = false;
  budgets: Budget[] = [];
  
  editingBudgetId: number | null = null;
  editedBudget: Partial<Budget> = {};
  newBudget: Partial<Budget> = {};
  
  // Add validation error messages
  validationErrors: { [key: string]: string } = {};
  
  // Helper method to check if form has errors
  hasValidationErrors(): boolean {
    return Object.keys(this.validationErrors).length > 0;
  }

  addBudget() {
    if (!this.validateNewBudget()) {
      return;
    }

    this.budgetService.createBudget(this.newBudget).subscribe({
      next: (createdBudget) => {
        console.log('Budget created successfully:', createdBudget);
        this.newBudget = {}; // Reset form
        this.fetchBudgets(); // Refresh the list
      },
      error: (error) => {
        console.error('Error creating budget:', error);
        alert('Failed to create budget. Please try again.');
      }
    });
  }

  validateNewBudget(): boolean {
    this.validationErrors = {};
    let isValid = true;

    if (!this.newBudget.eventId) {
      this.validationErrors['eventId'] = 'Event ID is required';
      isValid = false;
    }

    if (!this.newBudget.eventName?.trim()) {
      this.validationErrors['eventName'] = 'Event Name is required';
      isValid = false;
    }

    if (!this.newBudget.budgetAllocated || this.newBudget.budgetAllocated <= 0) {
      this.validationErrors['budgetAllocated'] = 'Allocated budget must be greater than 0';
      isValid = false;
    }

    if (!this.newBudget.preparedBy?.trim()) {
      this.validationErrors['preparedBy'] = 'Prepared By field is required';
      isValid = false;
    }

    return isValid;
  }
  
  constructor(
    private profileService: ProfileService,
    private router: Router,
    private budgetService: BudgetService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    console.log('inside dashboard and ngonit');
    this.profileService.getCurrentUserProfile().subscribe(
      (res) => {
        console.log('success' + res);
        localStorage.setItem('profile', JSON.stringify(res));
        this.fetchBudgets();
      },
      (err) => {
        this.createProfileButton = true;
        console.log('failed...' + JSON.stringify(err));
      }
    );
  }
  
  fetchBudgets() {
    this.budgetService.getBudgets().subscribe(
      (data: Budget[]) => {
        this.budgets = data;
        console.log('Budgets:', this.budgets);
      },
      (error) => {
        console.error('Failed to load budgets', error);
      }
    );
  }
  
  // Validation method for edit budget
  validateEditBudget(): boolean {
    this.validationErrors = {};
    let isValid = true;
    
    if (!this.editedBudget.budgetAllocated || this.editedBudget.budgetAllocated <= 0) {
      this.validationErrors['editAllocated'] = 'Allocated budget must be greater than 0';
      isValid = false;
    }
    
    if (!this.editedBudget.budgetUtilized || this.editedBudget.budgetUtilized < 0) {
      this.validationErrors['editUtilized'] = 'Utilized budget cannot be negative';
      isValid = false;
    }
    
    if ((this.editedBudget.budgetUtilized ?? 0) > (this.editedBudget.budgetAllocated ?? 0)) {
      this.validationErrors['editUtilized'] = 'Utilized budget cannot exceed allocated budget';
      isValid = false;
    }
    
    if (!this.editedBudget.preparedBy?.trim()) {
      this.validationErrors['editPreparedBy'] = 'Prepared By field is required';
      isValid = false;
    }
    
    return isValid;
  }
  
  // Real-time validation for edit form
  onEditBudgetChange() {
    const allocated = this.editedBudget.budgetAllocated || 0;
    const utilized = this.editedBudget.budgetUtilized || 0;
    
    if (utilized > allocated && allocated > 0) {
      this.validationErrors['editUtilized'] = 'Utilized budget cannot exceed allocated budget';
    } else {
      delete this.validationErrors['editUtilized'];
    }
  }
  
  startEdit(budget: Budget) {
    this.editingBudgetId = budget.id;
    this.editedBudget = { 
      budgetAllocated: budget.budgetAllocated,
      budgetUtilized: budget.budgetUtilized,
      preparedBy: budget.preparedBy,
    };
    this.validationErrors = {};
    console.log('Editing budget:', this.editedBudget);
  }
  
  updateBudget() {
    if (!this.editingBudgetId || !this.validateEditBudget()) {
      console.log('Validation failed or no editing ID');
      return;
    }
    
    const budgetToUpdate: Partial<Budget> = {
      budgetAllocated: Number(this.editedBudget.budgetAllocated),
      budgetUtilized: Number(this.editedBudget.budgetUtilized),
      preparedBy: this.editedBudget.preparedBy?.trim()
    };

    console.log('Updating budget:', this.editingBudgetId, budgetToUpdate);
    
    this.budgetService.updateBudget(this.editingBudgetId, budgetToUpdate)
      .subscribe({
        next: (updated) => {
          console.log('Budget updated successfully:', updated);
          this.fetchBudgets();
          this.cancelEdit();
        },
        error: (error) => {
          console.error('Failed to update budget:', error);
          if (error.status === 404) {
            alert('Budget not found. It may have been deleted.');
          } else {
            alert('Failed to update budget. Please try again.');
          }
          this.fetchBudgets(); // Refresh the list
        }
      });
  }
  
  cancelEdit() {
    this.editingBudgetId = null;
    this.editedBudget = {};
    this.validationErrors = {}; // Clear validation errors
  }
  
  deleteBudget(id: number) {
    if (confirm('Are you sure you want to delete this budget?')) {
      this.budgetService.deleteBudget(id).subscribe(
        () => {
          this.fetchBudgets();
        },
        (error) => {
          console.error('Failed to delete budget', error);
        }
      );
    }
  }
  
  createProfile() {
    this.router.navigate(['/profiles/create-profile']);
  }
  
  navigateTo(path: string) {
    // Only allow navigation to authorized routes
    const allowedPaths = ['dashboard', 'profiles', 'budgets'];
    if (allowedPaths.some(allowed => path.startsWith(allowed))) {
      this.router.navigate([`/${path}`]);
    } else {
      console.warn('Navigation to unauthorized path attempted:', path);
    }
  }
  
  viewAllBudgets() {
    this.router.navigate(['/dashboard/budgets']);
  }
}