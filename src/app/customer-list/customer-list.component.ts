import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularGridInstance, Column, Editors, FieldType, Filters, Formatters, GridOption, OnEventArgs, FilterService, SlickGrid, FormatterResultObject } from 'angular-slickgrid';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { RestService } from '../rest.service';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: any;
  isLoading: boolean = true;
  isFilterEnabled: boolean = false;
  gridObj: any;
  filterService: any;
  dataviewObj: any;

  selected = 'option2';
  isLazyLoading: boolean = true;

  constructor(public http: HttpClient, private rest: RestService,private changeRef: ChangeDetectorRef,
    private renderer: Renderer2, private router: Router, public activatRoute: ActivatedRoute) {

    if (this.angularGrid?.paginationService) {
      this.angularGrid.paginationService.changeItemPerPage(this.angularGrid.paginationService.itemsPerPage);
    }

    // this.renderer.listen('window', 'change', () => {

    //   $(".slick-cell.active").on("change", () => {
    //     alert("The text has been changed.");
    //   });

    // })

    this.prepareGrid();

    // for (let i = 1; i < 10; i++) {
    //   this.dataset.push({ id: i });
    // }

    // fill the dataset with your data
    // this.http.get('./assets/customerData.json', { responseType: 'json' }).subscribe((res: any) => {
    //     for (let data of res) {
    //       data['_id'] = data['id'];
    //       data["dob"] = "1997-11-27";
    //       data["avatar"] = "https://reqres.in/img/faces/9-image.jpg";
    //     }
    //     this.dataset = [];
    //     this.dataset.push(res);
    //     this.dataset = this.dataset[0];
    //     this.isLoading = false;
    //     this.isLazyLoading = false;
    // });

    let collectionName = 'sg_customer_records';
    this.rest.findAll(collectionName).then((result: any) => {
      console.log("findAll", result);
        if(result.status === 'success') {
          let datas = [];
          for (let data of result['records']['rows']) {
            data.doc['id'] = data['doc']['_id'];
            datas.push(data['doc'])
          }
          this.dataset = [];
          this.dataset.push(datas);
          this.dataset = this.dataset[0];
          this.angularGrid.paginationService.changeItemPerPage(this.angularGrid.paginationService.itemsPerPage);
          this.isLoading = false;
          this.isLazyLoading = false;
        }
        else {
          Swal.fire("Fetching failed");
          this.isLoading = false;
          this.isLazyLoading = false;
          this.dataset = [];
        }
    });

  }

  ngOnInit() {
    this.listenToChanges();
  }

  cloneButtonOnClick() {
    this.isLoading = true;
    const selectedRows = this.angularGrid.slickGrid.getSelectedRows();
    if (selectedRows.length > 0 && selectedRows.length === 1) {
      const selectedData = selectedRows.map((rowIndex: any) => {
        return this.angularGrid.slickGrid.getDataItem(rowIndex);
      });

      console.log('onRecordEdit: ', selectedData);
      delete selectedData[0]['id'];
      delete selectedData[0]['_id'];
      delete selectedData[0]['_rev'];
      let clonedData = { selectedData: JSON.stringify(selectedData[0]), action: 'clone' };
      // clonedData['action'] = 'clone';

      this.router.navigate(['/entry'], { queryParams: clonedData, skipLocationChange: true });
    } 
    else {
      Swal.fire("Select at least one record to clone");
      this.isLoading = false;
    }
  }

  onRecordEdit() {

    if (this.isLoading) {
      Swal.fire('Another process is going on...');
      return;
    } else {
      const selectedRows = this.angularGrid.slickGrid.getSelectedRows();
      if (selectedRows.length > 0 && selectedRows.length === 1) {
        const selectedData = selectedRows.map((rowIndex: any) => {
          return this.angularGrid.slickGrid.getDataItem(rowIndex);
        });
        console.log('onRecordEdit: ', selectedData);
        let editData = { selectedData: JSON.stringify(selectedData[0]), action: 'edit' };
        this.router.navigate(['/entry'], { queryParams: editData, skipLocationChange: true });
      } else if (selectedRows.length > 1) {
        Swal.fire('Kindly select one record...');
      } else {
        Swal.fire("Kindly select records...");
      }
    }
  }

  bulkDelete() {

    this.isLoading = true;
    const selectedRows = this.angularGrid.slickGrid.getSelectedRows();
    if (selectedRows.length > 0) {
      const selectedData = selectedRows.map((rowIndex: any) => {
        return this.angularGrid.slickGrid.getDataItem(rowIndex);
      });
      console.log(selectedData);
      selectedData.map((res: { id: any; _rev: any; _id: any; }) => {
        this.angularGrid.gridService.deleteItemById(res._id);
        // let url = '/sg_customer_records/' + res._id + "?rev=" + res._rev;
        // this.http.delete(url).subscribe((res: any) => {
        //   console.log("Record Deleted succuessfully...", res);
        //   this.angularGrid.paginationService.changeItemPerPage(this.angularGrid.paginationService.itemsPerPage);
        //   this.isLoading = false;
        // })
        // this.angularGrid.paginationService.changeItemPerPage(this.angularGrid.paginationService.itemsPerPage);
        // this.isLoading = false;
        this.rest.deleteOne('sg_customer_records', res._id, res._rev).then((delResponse:any) => {
          if(delResponse['status'] === "success") {
          this.angularGrid.paginationService.changeItemPerPage(this.angularGrid.paginationService.itemsPerPage);
          this.isLoading = false;
          }
          else {
            this.angularGrid.paginationService.changeItemPerPage(this.angularGrid.paginationService.itemsPerPage);
            this.isLoading = false;
          }
        })
      });
    } else {
      Swal.fire("Select at least one record to delete");
      this.isLoading = false;
    }
  }

  onToggleFilter() {

    if (this.gridObj.getOptions().showHeaderRow) {
      this.gridObj.setHeaderRowVisibility(false);
    } else if (!this.gridObj.getOptions().showHeaderRow) {
      this.gridObj.setHeaderRowVisibility(true);
    }
  }


  prepareGrid() {
    this.columnDefinitions = [
      // {
      //   id: '_checkbox_selector',
      //   name: '',
      //   field: '',
      //   minWidth: 40,
      //   maxWidth: 40,
      //   resizable: false,
      //   sortable: false,
      //   selectable: false,
      //   // formatter: Formatters.checkbox,
      //   formatter: Formatters.checkbox,
      //   editor: {
      //     model: Editors.checkbox,
      //     required: true,
      //     collection: [
      //       { value: true, label: 'True' },
      //       { valued: false, label: 'False' }
      //     ]
      //   },
      //   cssClass: 'slick-cell-checkboxsel',
      //   cannotTriggerInsert: true,
      //   excludeFromExport: true
      // },
      {
        id: 'delete',
        name: 'Delete',
        field: '_id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        cssClass: "delete-icon",
        minWidth: 60,
        maxWidth: 60,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
          console.log(args);
          if (confirm('Are you sure want to delete ?')) {
            this.isLoading = true;
            this.angularGrid.gridService.deleteItemById(args.dataContext.id);

            let url =
              '/sg_customer_records/' +
              args.dataContext._id +
              '?rev=' +
              args.dataContext._rev;
            this.http.delete(url).subscribe((res: any) => {
              console.log('Record Deleted succuessfully...', res);
              this.angularGrid.paginationService.changeItemPerPage(
                this.angularGrid.paginationService.itemsPerPage
              );
              this.isLoading = false;
            });
          }
        },
      },
      {
        id: 'view',
        name: 'View',
        field: 'view',
        excludeFromHeaderMenu: true,
        formatter: customDataFormatter,
        cssClass: "view-icon",
        minWidth: 60,
        maxWidth: 60,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
          console.log(args);
          let viewData = {_id: args.dataContext._id, _rev: args.dataContext._rev}
          console.log("view-icon", viewData);
          this.router.navigate(['/view'], { queryParams: viewData, skipLocationChange: true });
        },
      },
      {
        id: 'name',
        name: 'Emp Name',
        field: 'name',
        sortable: true,
        formatter: customDataFormatter,
        toolTip: 'name',
        type: FieldType.string,
        editor: {
          model: Editors.text,
          required: true,
        },
        filterable: true,
        filter: {
          model: Filters.compoundInput,
          placeholder: '🔎︎ ',
        },
        onCellClick: (e, args) => {
          console.log(e);
          console.log(args);
        },
      },
      {
        id: 'dob',
        name: 'Date of Birth',
        field: 'dob',
        sortable: true,
        minWidth: 100,
        formatter: customDataFormatter,
        // formatter: Formatters.dateIso,
        // columnGroup: 'Period',
        exportCustomFormatter: Formatters.dateIso,
        type: FieldType.date,
        outputType: FieldType.dateIso,
        saveOutputType: FieldType.dateIso,
        filterable: true,
        filter: { model: Filters.compoundDate },
        editor: {
          model: Editors.date,
          massUpdate: true,
          params: { hideClearButton: false },
        },
      },
      {
        id: 'age',
        name: 'Age',
        field: 'age',
        formatter: customDataFormatter,
        sortable: true,
        editor: {
          model: Editors.integer,
          required: true,
        },
        filterable: true,
        filter: {
          model: Filters.compoundInputNumber,
        },
      },
      {
        id: 'gender',
        name: 'Gender',
        field: 'gender',
        sortable: true,
        type: FieldType.text,
        formatter: customDataFormatter,
        editor: {
          model: Editors.singleSelect,
          required: true,
          collection: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ],
        },
        filterable: true,
        filter: {
          enableTranslateLabel: true,
          model: Filters.multipleSelect,
          collection: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ],
        },
      },
      {
        id: 'company',
        name: 'Company',
        field: 'company',
        formatter: customDataFormatter,
        editor: {
          model: Editors.text,
          required: true,
        },
        filterable: true,
        filter: {
          model: Filters.compoundInput,
        },
      },
      {
        id: 'email',
        name: 'Email',
        field: 'email',
        formatter: customDataFormatter,
        editor: {
          model: Editors.text,
          required: true,
        },
        filterable: true,
        filter: {
          model: Filters.compoundInput,
        },
      },
      {
        id: 'phone',
        name: 'Phone',
        field: 'phone',
        formatter: customDataFormatter,
        editor: {
          model: Editors.integer,
          required: true,
        },
        filterable: true,
        filter: {
          model: Filters.compoundInput,
        },
      },
      {
        id: 'address',
        name: 'Address',
        field: 'address',
        formatter: customDataFormatter,
        editor: {
          model: Editors.longText,
          required: true,
        },
        filterable: true,
        filter: {
          model: Filters.compoundInput,
        },
      },
      {
        id: '_attachments.image.data',
        name: 'Avatar',
        field: "avatar",
        formatter: customDataFormatter,
        sortable: true
      },
    ];

    this.gridOptions = {
      autoEdit: false, // true single click (false for double-click)
      enableEmptyDataWarningMessage: true, // required to show the message
      emptyDataWarning: {
        message: 'There is no data to display.', // set your own message here
        // image: '/Angular-Slick-Grid/src/assets/img/No data.png', // path to your custom image
      },
      enableCheckboxSelector: true,
      checkboxSelector: {
        // you can toggle these 2 properties to show the "select all" checkbox in different location
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: false,
        columnId: '_checkbox_selector',
        cssClass: 'slick-cell-checkboxsel'
      },
      enableRowSelection: true,
      enableAutoResize: true,
      enableSorting: true,
      enableFiltering: true,
      enableGridMenu: true,
      gridMenu: {
        commandTitle: 'Custom Commands',
        columnTitle: 'Columns',
        iconCssClass: 'fa fa-ellipsis-v',
        menuWidth: 17,
        // resizeOnShowHeaderRow: true,
        commandItems: [
          {
            iconCssClass: 'fa fa-filter text-danger',
            title: 'Clear All Filters',
            disabled: false,
            command: 'clear-filter'
          },
          {
            iconCssClass: 'fa fa-random',
            title: 'Toggle Filter Row',
            disabled: false,
            command: 'toggle-filter'
          }
        ],
        onCommand: (e, args) => {
          if (args.command === 'toggle-filter') {
            this.gridObj = args.grid;
            this.onToggleFilter;
          }
          else if (args.command === 'clear-filter') {
            this.filterService.clearFilters();
            this.dataviewObj.refresh();
          }
        }
      },
      // enableExcelCopyBuffer: true,
      editable: true,
      enableTranslate: false,
      autoCommitEdit: true,
      gridHeight: 400,
      gridWidth: 1285,
      rowHeight: 40,
      enablePagination: true,
      pagination: {  // Pagination UI - Item per page select options for default pagintation
        pageSizes: [5, 10, 15, 20, 25, 50, 75, 100, 200, 1000, 2000],
        pageSize: 100
      },
      asyncEditorLoading: true,
      enableCellNavigation: true,

      enableAutoTooltip: true,
      autoTooltipOptions: {
        enableForCells: true,
        enableForHeaderCells: true,
        maxToolTipLength: 1000
      },
    };
  }

  angularGridReady(angularGrid: any) {
    this.angularGrid = angularGrid.detail;
    this.gridObj = angularGrid.detail.slickGrid;
    this.filterService = angularGrid.detail.filterService;
    this.dataviewObj = angularGrid.detail.dataView;
    if (this.gridObj.getOptions().showHeaderRow) {
      this.gridObj.setHeaderRowVisibility(false);
    }
    // this.angularGrid.resizerService.resizeGrid();
    // this.angularGrid.slickGrid.render();
    // angularGrid.paginationService.changeItemPerPage(angularGrid.paginationService.itemsPerPage);
  }

  setSortingDynamically() {
    this.angularGrid.sortService.updateSorting([
      // orders matter, whichever is first in array will be the first sorted column
      { columnId: 'name', direction: 'ASC' },
      { columnId: 'age', direction: 'DESC' },
    ]);
  }

  onCellChanged(event: any) {
    console.log(event);

    let url = '/sg_customer_records/' + event.detail.args.item._id;
    let item = event.detail.args.item;
    this.http.put(url, event.detail.args.item).subscribe((result: any) => {
      console.log("Update successfully...", result);

      if (item['_rev']) {
        item['_rev'] = result['rev'];
      }
      const dataView = event.detail.args.grid.getData();
      if (dataView) {
        dataView.beginUpdate();
        const value = dataView.getItemById(item['id'])
        if (value) {
          dataView.updateItem(item['id'], item);
        } else {
          dataView.addItem(item);
        }
        dataView.endUpdate();
        dataView.reSort();
      }

    });
  }

  // -----------Live Listener---------------------

  listenToChanges() {
    // const url = 'http://localhost:5984/mydatabase/_changes?feed=eventsource';

    // const url = 'http://localhost:5984/mydatabase/_changes?feed=eventsource&live=true&continuous=true&since=last_seq&timeout=30000&include_docs=true&attachments=true';

    const url = '/sg_customer_records/_changes?feed=eventsource&live=true&continuous=true&include_docs=true&attachments=true';

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      console.log('Changes:', JSON.parse(event.data));
    };

    eventSource.onerror = (error) => {
      console.error('Error:', error);
    };
  }

  backButtonClick() {
    history.back()
  }

}

export function customDataFormatter(row: number, cell: number, value: any, columnDef: Column<any>, dataContext: any, grid: any) {
  // throw new Error('Function not implemented.');

  let outPutTag: any = '';
  if (["name", "dob", "age", "company", "email", "phone", "address"].includes(columnDef['field'])) {
    return value;
  }
  if (columnDef?.field === "avatar") {
    if (dataContext['_attachments'] && dataContext['_attachments']['image']['data']) {
      return outPutTag += `<img src="data:image/png;base64,${dataContext['_attachments']['image']['data']}" width="30px" height="30px" style="border-radius: 50%"/>`;    
    } else {
      return outPutTag += `<img src="assets/img/user_icon.png" width="30px" height="30px" style="border-radius: 50%"/>`;    
    }
    // return value.toUpperCase();
  } else if (columnDef?.field === "gender") {
    return outPutTag += `<span><i class="${value === 'male' ? 'fa fa-male' : 'fa fa-female'}" style="${value === 'male' ? 'color: #2196F3;' : 'color: red;'}" aria-hidden="true"></i>&nbsp; ${value}</span>`
  }   if (columnDef?.field === "view") {
    return outPutTag += `<div style="cursor: pointer;"><i class="fa fa-folder-open" aria-hidden="true"></i></div>`;    
  } else {
    return outPutTag += `<div class="animated-gradient"></div>`;
  }
  // src="data:image/png;base64,{{dataContext['_attachments']['image']['data'}}"
}
