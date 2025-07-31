import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

export interface PaymentSurrender {
  id: string;
  no: string;
  currencyCode: string;
  amountAdvanced: number;
  actualSpent: number;
  description: string;
  status: string;
}

@Component({
  selector: 'app-payment-surrender',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './payment-surrender.component.html',
  styleUrls: ['./payment-surrender.component.scss']
})
export class PaymentSurrenderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  sidebarOpen = false;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  
  paymentSurrenderList: PaymentSurrender[] = [
    {
      id: '1',
      no: 'SUBPS_0020',
      currencyCode: 'KES',
      amountAdvanced: 160000,
      actualSpent: 100000,
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '2',
      no: 'SUBPS_0020',
      currencyCode: 'KES',
      amountAdvanced: 160000,
      actualSpent: 100000,
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '3',
      no: 'SUBPS_0020',
      currencyCode: 'KES',
      amountAdvanced: 160000,
      actualSpent: 100000,
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '4',
      no: 'SUBPS_0020',
      currencyCode: 'KES',
      amountAdvanced: 160000,
      actualSpent: 100000,
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '5',
      no: 'SUBPS_0020',
      currencyCode: 'KES',
      amountAdvanced: 160000,
      actualSpent: 100000,
      description: 'For wards',
      status: 'Open'
    },
    {
      id: '6',
      no: 'SUBPS_0021',
      currencyCode: 'KES',
      amountAdvanced: 180000,
      actualSpent: 120000,
      description: 'Equipment purchase',
      status: 'Open'
    },
    {
      id: '7',
      no: 'SUBPS_0022',
      currencyCode: 'KES',
      amountAdvanced: 200000,
      actualSpent: 150000,
      description: 'Training materials',
      status: 'Open'
    },
    {
      id: '8',
      no: 'SUBPS_0023',
      currencyCode: 'KES',
      amountAdvanced: 120000,
      actualSpent: 80000,
      description: 'Office supplies',
      status: 'Open'
    }
  ];
  
  get totalPages(): number {
    return Math.ceil(this.paymentSurrenderList.length / this.itemsPerPage);
  }
  
  get paginatedData(): PaymentSurrender[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.paymentSurrenderList.slice(startIndex, endIndex);
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize component
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToNewPaymentSurrender() {
    this.router.navigate(['/new-payment-surrender']);
  }

  viewSurrender(id: string) {
    this.router.navigate(['/new-payment-surrender', id]);
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