import { ApiCommonService } from './../../../service/common/api-common.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { GlobalDeleteDialogComponent } from '../common/global-delete-dialog/global-delete-dialog.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  displayedColumns: string[] = ['_id', 'createdAt', 'title', 'description', 'position', 'action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  paginateStartNo = 0;

  constructor(
    private apiCommon: ApiCommonService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.apiCommon.get('category').subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });

  }

  delete(id): void {

    const dialogRef = this.dialog.open(GlobalDeleteDialogComponent, {
      width: '400px',
      data: {
        title: 'Category',
        url: 'category/',
        id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === id) {
        this.dataSource.data.map( (item, index) => {
          if (item._id === id) {
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription();
          }
        });
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
