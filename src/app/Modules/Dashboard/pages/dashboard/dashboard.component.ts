import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../../components/Header/header.component';
import { ProductService } from '../../../../Services/Product/product.service';
import { Product } from '../../models/product';
import { BehaviorSubject, filter, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../Services/Auth/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../../../Services/Notification/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule, ReactiveFormsModule,TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private notification = inject(NotificationService);
  private productService = inject(ProductService);
  private translate = inject(TranslateService);

  /**
   * ViewChild to take product modal reference.
   */
  @ViewChild('productModal') productModal!: ElementRef;

  /**
   * BehaviorSubject to trigger product refresh.
   */
  private _refreshProduct$ = new BehaviorSubject<boolean>(true);

  /**
   * Take BehaviorSubject as observable.
   */
  refreshProduct$ = this._refreshProduct$.asObservable();

  /**
   * Product form initializarion
   */
  productForm: FormGroup = this.fb.group({
    description: this.fb.control('', Validators.required),
    name: this.fb.control('', Validators.required),
    price: this.fb.control('', Validators.required),
  });

  /**
   * Hold all products.
   */
  products = signal<Product[]>([]);

  /**
   * Hold filtered products.
   */
  filteredProducts = signal<Product[]>([]);

  /**
   * Hold User role.
   */
  userRole = signal<string>('');

  /**
   * Search term value.
   */
  searchTerm = signal<string>('');

  /**
   * Hold product id.
   */
  id = signal<string>('');

  /**
   * Hold delete product id.
   */
  deleteId = signal<string>('');

  /**
   * Hold product for view.
   */
  selectedProduct = signal<Product | null>(null);

  /**
   * THis signal use to get products whenever required.
   */
  getProduct$ = this._refreshProduct$.pipe(
    filter((value) => !!value),
    switchMap(() => this.productService.getProduct()),
    tap((product: Product[]) => {
      const user = this.authService.getUser();
      if (user) {
        this.userRole.set(user.role);
      }
      this.products.set(product);
      this.filteredProducts.set(product);
    })
  );

  /**
   * Filter products by search term.
   */
  filterBySearch(): void {
    const searchString = this.searchTerm().toLowerCase();
    const filtered = this.products().filter((product) =>
      product.name.toLowerCase().includes(searchString)
    );
    this.filteredProducts.set(searchString ? filtered : this.products());
  }

  /**
   * Sort products by name.
   *
   * @param sortOrder - 'asc' or 'desc'
   */
  sortProductsByName(sortOrder: string): void {
    const sorted = [...this.filteredProducts()].sort((a, b) =>
      sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    this.filteredProducts.set(sorted);
  }

  /**
   * Handle adding or updating a product.
   */
  submitProduct(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;

      const productAction = this.id()
        ? this.productService.updateProduct(this.id(), productData)
        : this.productService.addProduct(productData);

      productAction.subscribe(
        (res) => {
          console.log(res);
          this._refreshProduct$.next(true);
          this.closeModal();
          this.id()
            ? this.notification.success('Product updated successfully!')
            : this.notification.success('Product added successfully!');
        },
        (err) => {
          console.error(err);
          this.notification.error('Error while adding or updating product');
        }
      );
    } else {
      this.productForm.markAllAsTouched();
      this.notification.warning('Fill all required field!');
    }
  }

  /**
   * Handle open modal.
   */
  openModal(product: Product, state: string): void {
    if (
      product.id &&
      (this.userRole() === 'Admin' || 'Manager') &&
      state === 'edit'
    ) {
      this.id.set(product.id);
      this.productForm.patchValue(product);
      $('#addProductModal').modal('show');
    } else {
      this.selectedProduct.set(product);
      $('#addProductModal').modal('hide');
      $('#viewProductModal').modal('show');
    }
  }

  /**
   * Open delete confirmation modal.
   */
  openDeleteModal(id?: string): void {
    if (id) {
      this.deleteId.set(id);
      $('#deleteModal').modal('show');
    }
  }

  /**
   * Handle Delete product.
   */
  deleteProduct(): void {
    if (this.deleteId()) {
      this.productService.removeProduct(this.deleteId()).subscribe(
        (res) => {
          console.log(res);
          this._refreshProduct$.next(true);
          $('#deleteModal').modal('hide');
          this.deleteId.set('');
          this.notification.success('Product deleted successfully!');
        },
        (err) => {
          console.error(err);
          this.notification.error('Error while deleting product');
        }
      );
    }
  }

  /**
   * Close modal and reset form.
   */
  closeModal(): void {
    $('#addProductModal').modal('hide');
    this.onModalDismiss();
  }

  /**
   * Handle form reset on modal dismiss.
   */
  onModalDismiss(): void {
    this.productForm.reset();
    this.productForm.clearValidators();
    this.productForm.markAsPristine();
  }
}
