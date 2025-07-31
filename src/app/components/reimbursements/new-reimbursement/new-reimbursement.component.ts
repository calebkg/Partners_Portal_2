import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

export interface ReimbursementLine {
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
  selector: 'app-new-reimbursement',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './new-reimbursement.component.html',
  styleUrls: ['./new-reimbursement.component.scss']
})
export class NewReimbursementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  sidebarOpen = false;
  reimbursementForm!: FormGroup;
  reimbursementLineForm!: FormGroup;
  showAddLineModal = false;
  isEditMode = false;
  currentEditingLine: ReimbursementLine | null = null;
  
  reimbursementLines: ReimbursementLine[] = [
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
    this.reimbursementForm = this.fb.group({
      documentNo: ['SUBPR-25-0021'],
      currencyCode: ['KES'],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });

    this.reimbursementLineForm = this.fb.group({
      currencyCode: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });
  }

  openAddLineModal() {
    this.showAddLineModal = true;
    this.isEditMode = false;
    this.reimbursementLineForm.reset();
  }

  openEditLineModal(line: ReimbursementLine) {
    this.showAddLineModal = true;
    this.isEditMode = true;
    this.currentEditingLine = line;
    this.reimbursementLineForm.patchValue(line);
  }

  closeAddLineModal() {
    this.showAddLineModal = false;
    this.isEditMode = false;
    this.currentEditingLine = null;
    this.reimbursementLineForm.reset();
  }

  submitLine() {
    if (this.reimbursementLineForm.valid) {
      const formValue = this.reimbursementLineForm.value;
      
      if (this.isEditMode && this.currentEditingLine) {
        // Update existing line
        const index = this.reimbursementLines.findIndex(line => line.id === this.currentEditingLine!.id);
        if (index !== -1) {
          this.reimbursementLines[index] = {
            ...this.currentEditingLine,
            ...formValue
          };
        }
      } else {
        // Add new line
        const newLine: ReimbursementLine = {
          id: Date.now().toString(),
          ...formValue
        };
        this.reimbursementLines.push(newLine);
      }
      
      this.closeAddLineModal();
    }
  }

  deleteLine(lineId: string) {
    this.reimbursementLines = this.reimbursementLines.filter(line => line.id !== lineId);
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
    if (this.reimbursementForm.valid) {
      console.log('Reimbursement Form:', this.reimbursementForm.value);
      console.log('Reimbursement Lines:', this.reimbursementLines);
      console.log('Uploaded Documents:', this.uploadedDocuments);
      
      // Navigate back to reimbursements list
      this.router.navigate(['/reimbursements']);
    }
  }

  onCancel() {
    this.router.navigate(['/reimbursements']);
  }
}