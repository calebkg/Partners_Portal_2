import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

export interface PaymentSurrenderLine {
  id: string;
  currencyCode: string;
  amount: number;
  description: string;
  secondCurrencyCode?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
}

@Component({
  selector: 'app-new-payment-surrender',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './new-payment-surrender.component.html',
  styleUrls: ['./new-payment-surrender.component.scss']
})
export class NewPaymentSurrenderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  sidebarOpen = false;
  paymentSurrenderForm!: FormGroup;
  paymentSurrenderLineForm!: FormGroup;
  showAddLineModal = false;
  isEditMode = false;
  currentEditingLine: PaymentSurrenderLine | null = null;
  
  paymentSurrenderLines: PaymentSurrenderLine[] = [
    {
      id: '1',
      currencyCode: 'KSH',
      amount: 16000,
      description: 'Cooperate Meeting'
    }
  ];
  
  uploadedDocuments: UploadedDocument[] = [
    {
      id: '1',
      name: 'Financial Report',
      type: 'PDF',
      size: 1024000,
      uploadDate: '2025-01-15'
    },
    {
      id: '2',
      name: 'Bank Reconciliation',
      type: 'PDF',
      size: 2048000,
      uploadDate: '2025-01-15'
    },
    {
      id: '3',
      name: 'Vouchers',
      type: 'PDF',
      size: 1536000,
      uploadDate: '2025-01-15'
    }
  ];
  
  currencyOptions = [
    { code: 'KSH', name: 'Kenyan Shilling' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    // Initialize component
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms() {
    this.paymentSurrenderForm = this.fb.group({
      paymentRequest: ['', Validators.required],
      currencyCode: ['KES'],
      disbursedAmount: [120000],
      surrenderCurrencyCode: ['KES'],
      surrenderedAmount: ['', [Validators.required, Validators.min(1)]],
      surrenderDate: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.paymentSurrenderLineForm = this.fb.group({
      currencyCode: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      secondCurrencyCode: [''],
      description: ['', Validators.required]
    });
  }

  openAddLineModal() {
    this.showAddLineModal = true;
    this.isEditMode = false;
    this.paymentSurrenderLineForm.reset();
  }

  openEditLineModal(line: PaymentSurrenderLine) {
    this.showAddLineModal = true;
    this.isEditMode = true;
    this.currentEditingLine = line;
    this.paymentSurrenderLineForm.patchValue(line);
  }

  closeAddLineModal() {
    this.showAddLineModal = false;
    this.isEditMode = false;
    this.currentEditingLine = null;
    this.paymentSurrenderLineForm.reset();
  }

  submitLine() {
    if (this.paymentSurrenderLineForm.valid) {
      const formValue = this.paymentSurrenderLineForm.value;
      
      if (this.isEditMode && this.currentEditingLine) {
        // Update existing line
        const index = this.paymentSurrenderLines.findIndex(line => line.id === this.currentEditingLine!.id);
        if (index !== -1) {
          this.paymentSurrenderLines[index] = {
            ...this.currentEditingLine,
            ...formValue
          };
        }
      } else {
        // Add new line
        const newLine: PaymentSurrenderLine = {
          id: Date.now().toString(),
          ...formValue
        };
        this.paymentSurrenderLines.push(newLine);
      }
      
      this.closeAddLineModal();
    }
  }

  deleteLine(lineId: string) {
    this.paymentSurrenderLines = this.paymentSurrenderLines.filter(line => line.id !== lineId);
  }

  triggerFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.handleFileUpload(file);
      }
    };
    fileInput.click();
  }

  private handleFileUpload(file: File) {
    // Simulate file upload
    const newDocument: UploadedDocument = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.includes('pdf') ? 'PDF' : 'Image',
      size: file.size,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    this.uploadedDocuments.push(newDocument);
  }

  viewDocument(document: UploadedDocument) {
    console.log('Viewing document:', document.name);
  }

  deleteDocument(documentId: string) {
    this.uploadedDocuments = this.uploadedDocuments.filter(doc => doc.id !== documentId);
  }

  onSubmit() {
    if (this.paymentSurrenderForm.valid) {
      console.log('Payment Surrender Form:', this.paymentSurrenderForm.value);
      console.log('Payment Surrender Lines:', this.paymentSurrenderLines);
      console.log('Uploaded Documents:', this.uploadedDocuments);
      
      // Navigate back to payment surrender list
      this.router.navigate(['/payment-surrender']);
    }
  }

  onCancel() {
    this.router.navigate(['/payment-surrender']);
  }
}