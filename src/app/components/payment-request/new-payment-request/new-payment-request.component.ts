import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

export interface PaymentRequestLine {
  id: string;
  currencyCode: string;
  amount: number;
  description: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
}

@Component({
  selector: 'app-new-payment-request',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './new-payment-request.component.html',
  styleUrls: ['./new-payment-request.component.scss']
})
export class NewPaymentRequestComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  sidebarOpen = false;
  paymentRequestForm!: FormGroup;
  paymentRequestLineForm!: FormGroup;
  showAddLineModal = false;
  isEditMode = false;
  currentEditingLine: PaymentRequestLine | null = null;
  
  paymentRequestLines: PaymentRequestLine[] = [
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
      name: 'Cash Request',
      type: 'PDF',
      size: 1024000,
      uploadDate: '2025-01-15'
    },
    {
      id: '2',
      name: 'Invoice',
      type: 'PDF',
      size: 2048000,
      uploadDate: '2025-01-15'
    },
    {
      id: '3',
      name: 'Quotation',
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
  
  documentTypes = [
    { value: 'cash-request', label: 'Cash Request' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'quotation', label: 'Quotation' },
    { value: 'receipt', label: 'Receipt' }
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
    this.paymentRequestForm = this.fb.group({
      documentNo: ['SUBPR-25-0021'],
      approvedFunding: ['', Validators.required],
      requestedDate: ['', Validators.required],
      requestedAmount: ['', [Validators.required, Validators.min(1)]],
      projectCode: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.paymentRequestLineForm = this.fb.group({
      currencyCode: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });
  }

  openAddLineModal() {
    this.showAddLineModal = true;
    this.isEditMode = false;
    this.paymentRequestLineForm.reset();
  }

  openEditLineModal(line: PaymentRequestLine) {
    this.showAddLineModal = true;
    this.isEditMode = true;
    this.currentEditingLine = line;
    this.paymentRequestLineForm.patchValue(line);
  }

  closeAddLineModal() {
    this.showAddLineModal = false;
    this.isEditMode = false;
    this.currentEditingLine = null;
    this.paymentRequestLineForm.reset();
  }

  submitLine() {
    if (this.paymentRequestLineForm.valid) {
      const formValue = this.paymentRequestLineForm.value;
      
      if (this.isEditMode && this.currentEditingLine) {
        // Update existing line
        const index = this.paymentRequestLines.findIndex(line => line.id === this.currentEditingLine!.id);
        if (index !== -1) {
          this.paymentRequestLines[index] = {
            ...this.currentEditingLine,
            ...formValue
          };
        }
      } else {
        // Add new line
        const newLine: PaymentRequestLine = {
          id: Date.now().toString(),
          ...formValue
        };
        this.paymentRequestLines.push(newLine);
      }
      
      this.closeAddLineModal();
    }
  }

  deleteLine(lineId: string) {
    this.paymentRequestLines = this.paymentRequestLines.filter(line => line.id !== lineId);
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
    if (this.paymentRequestForm.valid) {
      console.log('Payment Request Form:', this.paymentRequestForm.value);
      console.log('Payment Request Lines:', this.paymentRequestLines);
      console.log('Uploaded Documents:', this.uploadedDocuments);
      
      // Navigate back to payment request list
      this.router.navigate(['/payment-request']);
    }
  }

  onCancel() {
    this.router.navigate(['/payment-request']);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}