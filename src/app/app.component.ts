import { ElementRef, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { BrandData, CategoryData, ChartData, loadReportFromJson, ProductData, ReportData } from 'src/model/report-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Sale report';

  loadingReport: boolean = false;
  reportData: ReportData = null;

  selectedCategory: number = -1;
  selectedProduct: number = -1;
  selectedBrand: number = -1;

  chartData: ChartData = null;
  chartMin: number = -1;
  chartMax: number = -1;

  ngOnInit(): void {
    this.loadReport("assets/data.json");
  }

  loadReport(path: string): void {
    this.loadingReport = true;
    
    fetch(path)
      .then(r => r.json())
      .then(d => {
        this.reportData = loadReportFromJson(d);
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
    this.chartMin = Number.MAX_VALUE;
    this.chartMax = Number.MIN_VALUE;
    this.chartData = [{
      name: "Vendas",
      series: data.map(v => {
        this.chartMin = Math.min(this.chartMin, v[1]);
        this.chartMax = Math.max(this.chartMax, v[1]);
        return {
          name: v[0], value: v[1]
        }
      })
    }];
    let span = this.chartMax - this.chartMin;
    this.chartMin -= Math.floor(span * 0.2);
    this.chartMax += Math.ceil(span * 0.2);
  }
}
