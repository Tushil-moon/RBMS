import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../Modules/Dashboard/models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  /**
   * Actual api url to fetch data
   */
  private readonly apiURL: string = 'https://670754c2a0e04071d229d77b.mockapi.io/products';

  /**
   * make get request to get product
   *
   * @returns return product array
   */
  getProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL);
  }

  /**
   * make post request to add data
   *
   * @param data actual product detail
   * @returns added product detail
   */
  addProduct(data: Product): Observable<Product> {
    const body = data;
    return this.http.post<Product>(this.apiURL, body);
  }

  /**
   * make delete request to delete product
   *
   * @param id actual product id
   * @returns removed product detail
   */
  removeProduct(id: string): Observable<Product> {
    return this.http.delete<Product>(`${this.apiURL}/${id}`);
  }

  /**
   * make PUT reuest to update product
   *
   * @param id product id
   * @param data product detail
   * @returns updated product detail
   */
  updateProduct(id: string, data: Product): Observable<Product> {
    const body = data;
    return this.http.put<Product>(`${this.apiURL}/${id}`, body);
  }
}
