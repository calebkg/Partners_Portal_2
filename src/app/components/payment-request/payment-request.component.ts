import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

export interface PaymentRequest {
  id: string;
  funding: string;
  programme: string;
  purpose: string;
  budgetAmount: number;
  obligatedAmount: number;
  date: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-payment-request',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './payment-request.component.html',
  styleUrls: ['./payment-request.component.scss']
})
export class PaymentRequestComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  sidebarOpen = false;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  
  paymentRequestList: PaymentRequest[] = [
    {
      id: '1',
      funding: 'Grants',
      programme: 'Med supply',
      purpose: 'Pharmaceutical',
      budgetAmount: 160000,
      obligatedAmount: 100000,
      date: '20/5/2025',
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '2',
      funding: 'Grants',
      programme: 'Med supply',
      purpose: 'Pharmaceutical',
      budgetAmount: 160000,
      obligatedAmount: 100000,
      date: '20/5/2025',
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '3',
      funding: 'Grants',
      programme: 'Med supply',
      purpose: 'Pharmaceutical',
      budgetAmount: 160000,
      obligatedAmount: 100000,
      date: '20/5/2025',
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '4',
      funding: 'Grants',
      programme: 'Med supply',
      purpose: 'Pharmaceutical',
      budgetAmount: 160000,
      obligatedAmount: 100000,
      date: '20/5/2025',
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '5',
      funding: 'Grants',
      programme: 'Med supply',
      purpose: 'Pharmaceutical',
      budgetAmount: 160000,
      obligatedAmount: 100000,
      date: '20/5/2025',
      description: 'For wards',
      status: 'Open'
    }
  ];
  
  get totalPages(): number {
    return Math.ceil(this.paymentRequestList.length / this.itemsPerPage);
  }
  
  get paginatedData(): PaymentRequest[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.paymentRequestList.slice(startIndex, endIndex);
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize component
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToNewPaymentRequest() {
    this.router.navigate(['/new-payment-request']);
  }

  editRequest(id: string) {
    this.router.navigate(['/new-payment-request', id]);
  }

  viewRequest(id: string) {
    this.router.navigate(['/view-payment-request', id]);
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
  
  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

}