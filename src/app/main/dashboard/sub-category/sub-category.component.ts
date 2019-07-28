import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ApiCommonService } from 'src/app/service/common/api-common.service';
import { GlobalDeleteDialogComponent } from '../common/global-delete-dialog/global-delete-dialog.component';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

  displayedColumns: string[] = ['_id', 'createdAt', 'categoryId', 'title', 'description', 'position', 'action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  paginateStartNo = 0;

  constructor(
    private apiCommon: ApiCommonService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

    this.apiCommon.get('subcategory').subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  delete(id): void{

    const dialogRef = this.dialog.open(GlobalDeleteDialogComponent, {
      width: '400px',
      data: {
        title: 'SubCategory',
        url: 'subcategory/',
        id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === id) {
        this.ngOnInit();
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onPaginateChange(event) {
    this.paginateStartNo = event.pageIndex * event.pageSize;
}

}
