import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCommonService } from 'src/app/service/common/api-common.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  productForm: FormGroup;
  categoryData: any;
  subCategoryData: any;
  image: File;

  constructor(
    private fb: FormBuilder,
    private apiCommon: ApiCommonService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.productForm = this.fb.group({
      categoryId: ['', Validators.required],
      subCategoryId: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      position: ['', Validators.required],
      image: [this.image],
    });
   }

  ngOnInit() {

    this.apiCommon.get('category').subscribe(
      res => {
        this.categoryData = res;
      }
    );

    this.apiCommon.get('subcategory').subscribe(
      res => {
        this.subCategoryData = res;
      }
    );

  }

  handleImage(event): void {

    if (event.target.files && event.target.files[0]) {
      this.image = <File>event.target.files[0];
    }

  }

  onSubmit(): void{

    if (this.productForm.valid){

      const formData = new FormData();
      formData.append('categoryId', this.productForm.get('categoryId').value);
      formData.append('subCategoryId', this.productForm.get('subCategoryId').value);
      formData.append('title', this.productForm.get('title').value);
      formData.append('description', this.productForm.get('description').value);
      formData.append('position', this.productForm.get('position').value);
      formData.append('image', this.image, this.image.name);

      this.apiCommon.store('product', formData).subscribe(
        res => {
          if (res.status === 'success') {
            this.snackBar.open(res.message, 'close', {
              duration: 2500,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: ['snackbar-success']
            });
            this.router.navigateByUrl('/dashboard/product');
          }
        }
      )
    }

  }

}
