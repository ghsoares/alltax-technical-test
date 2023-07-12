







export type BrandData = Array<[string, number]>;

export type ProductData = Array<[string, BrandData]>;

export type CategoryData = Array<[string, ProductData]>;

export type ReportData = Array<[string, CategoryData]>;

export type ChartData = Array<{
	name: string,
	series: Array<{
		name: string,
		value: number
	}>
}>;

export const loadReportFromJson = (json: any): ReportData => {
	let reportData: ReportData = new Array();
	for (const category of Object.entries(json.categories) as any) {
		let categoryData: CategoryData = new Array();
		for (const product of Object.entries(category[1].products) as any) {
			let productData: ProductData = new Array();
			for (const brand of Object.entries(product[1].brands) as any) {
				productData.push([brand[0], brand[1]]);
			}
			categoryData.push([product[0], productData]);
		}
		reportData.push([category[0], categoryData]);
	}

	return reportData;
}