import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

export interface Reimbursement {
  id: string;
  no: string;
  currencyCode: string;
  amount: number;
  description: string;
  status: string;
}

@Component({
  selector: 'app-reimbursements',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './reimbursements.component.html',
  styleUrls: ['./reimbursements.component.scss']
})
export class ReimbursementsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  sidebarOpen = false;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 10;
  
  reimbursementsList: Reimbursement[] = [
    {
      id: '1',
      no: 'SUBPS_0020',
      currencyCode: 'KES',
      amount: 160000,
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '2',
      no: 'SUBPS_0020',
      currencyCode: 'KES',
      amount: 160000,
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '3',
      no: 'SUBPS_0020',
      currencyCode: 'KES',
      amount: 160000,
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '4',
      no: 'SUBPS_0020',
      currencyCode: 'KES',
      amount: 160000,
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '5',
      no: 'SUBPS_0020',
      currencyCode: 'KES',
      amount: 160000,
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '6',
      no: 'SUBPS_0021',
      currencyCode: 'KES',
      amount: 180000,
      description: 'Equipment reimbursement',
      status: 'Open'
    },
    {
      id: '7',
      no: 'SUBPS_0022',
      currencyCode: 'KES',
      amount: 200000,
      description: 'Training expenses',
      status: 'Open'
    },
    {
      id: '8',
      no: 'SUBPS_0023',
      currencyCode: 'KES',
      amount: 120000,
      description: 'Office supplies',
      status: 'Open'
    }
  ];
  
  get totalPages(): number {
    return Math.ceil(this.reimbursementsList.length / this.itemsPerPage);
  }
  
  get paginatedData(): Reimbursement[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.reimbursementsList.slice(startIndex, endIndex);
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize component
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToNewReimbursement() {
    this.router.navigate(['/new-reimbursement']);
  }

  viewReimbursement(id: string) {
    this.router.navigate(['/new-reimbursement', id]);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  lastPage() {
    this.currentPage = this.totalPages;
  }
}