import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { BrandData, CategoryData, ChartData, loadReportFromJson, ProductData, ReportData } from 'src/model/report-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sale report';

  loadingReport: boolean = false;
  reportData: ReportData = null;

  selectedCategory: number = -1;
  selectedProduct: number = -1;
  selectedBrand: number = -1;

  chartData: ChartData = null;

  constructor() {
    this.loadingReport = true;
    
    fetch("assets/data.json")
      .then(r => r.json())
      .then(d => {
        this.reportData = loadReportFromJson(d);
        console.log(this.reportData.at(0)?.at(1)?.at(0)?.at(1));
        this.loadingReport = false;
      })
      .catch(e => console.error(e));
  }

  getCategoryData(): CategoryData {
    if (this.selectedCategory == -1) return null;
    return this.reportData?.at(this.selectedCategory)?.at(1) as CategoryData;
  }

  getProductData(): ProductData {
    if (this.selectedProduct == -1) return null;
    return this.getCategoryData()?.at(this.selectedProduct)?.at(1) as ProductData;
  }

  getBrandData(): BrandData {
    if (this.selectedBrand == -1) return null;
    return this.getProductData()?.at(this.selectedBrand)?.at(1) as BrandData;
  }

  updateChartData(): void {
    if (this.selectedProduct != -1 && this.getProductData() == null) {
      this.selectedProduct = this.getCategoryData().length - 1;
    }
    if (this.selectedBrand != -1 && this.getBrandData() == null) {
      this.selectedBrand = this.getProductData().length - 1;
    }

    if (this.selectedCategory == -1 || this.selectedProduct == -1 || this.selectedBrand == -1) {
      this.chartData = null;
      return;
    }
    let data = this.getBrandData();
    if (data == null) {
      this.selectedCategory = -1;
      this.selectedProduct = -1;
      this.selectedBrand = -1;
      this.chartData = null;
    }
    this.chartData = [{
      name: "Vendas",
      series: data.map(v => {
        return {
          name: v[0], value: v[1]
        }
      })
    }];
  }
}
