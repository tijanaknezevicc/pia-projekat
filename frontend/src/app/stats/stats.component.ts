import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../services/property.service';
import { Property } from '../models/property';
import { Chart, registerables } from 'chart.js';
import { User } from '../models/user';
import { Reservation } from '../models/reservation';

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart', { static: false }) barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart', { static: false }) pieChartRef!: ElementRef<HTMLCanvasElement>;

  properties: Property[] = []
  reservations: Reservation[] = []

  currentPropertyIndex = 0
  loading = true
  barChart: Chart | null = null
  pieChart: Chart | null = null
  user: User = new User()

  monthlyData: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  weekendWeekdayData: number[] = [0, 0];

  private propertyService = inject(PropertyService)

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('logged')!);
    this.propertyService.getMyProperties(this.user).subscribe({
      next: (properties) => {
        this.properties = properties;
        this.generateDataForCurrentProperty();
        this.loading = false;
        setTimeout(() => this.createCharts(), 100);
      },
      error: () => {
        this.loading = false;
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(() => this.createCharts(), 100);
  }


  generateDataForCurrentProperty() {
    this.propertyService.getReservationsByProperty(this.currentProperty).subscribe(reservations => {
      this.reservations = reservations
      this.monthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      this.weekendWeekdayData = [0, 0]

      console.log(this.reservations)

      for (let reservation of this.reservations) {
        let startDate = new Date(reservation.dateBeg)
        let month = startDate.getMonth()
        this.monthlyData[month] += 1

        let endDate = new Date(reservation.dateEnd)
        let month2 = endDate.getMonth()
        if (month !== month2) {
          this.monthlyData[month2] += 1
        }

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          let day = d.getDay()
          if (day === 0 || day === 6) {
            this.weekendWeekdayData[0] += 1
          } else {
            this.weekendWeekdayData[1] += 1
          }
        }
      }

      this.weekendWeekdayData[0] /= 2
      this.weekendWeekdayData[1] /= 5

      this.updateCharts();
    })
  }

  createCharts() {
    this.createBarChart();
    this.createPieChart();
  }

  createBarChart() {
    if (this.barChart) this.barChart.destroy();

    const ctx = this.barChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
        datasets: [{
          label: 'rezervacije',
          data: this.monthlyData,
          backgroundColor: 'rgb(169, 61, 247)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'statistika po mesecima' }
        }
      }
    });
  }

  createPieChart() {
    if (this.pieChart) this.pieChart.destroy();

    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['vikend', 'radni dan'],
        datasets: [{
          data: this.weekendWeekdayData,
          backgroundColor: ['rgb(53, 164, 220)', 'rgb(169, 61, 247)']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'odnos vikend/radni dan' }
        }
      }
    });
  }

  nextProperty() {
    if (this.properties.length > 1) {
      this.currentPropertyIndex = (this.currentPropertyIndex + 1) % this.properties.length
      this.generateDataForCurrentProperty()
    }
  }

  prevProperty() {
    if (this.properties.length > 1) {
      this.currentPropertyIndex = this.currentPropertyIndex === 0
        ? this.properties.length - 1
        : this.currentPropertyIndex - 1
      this.generateDataForCurrentProperty()
    }
  }

  updateCharts() {
    if (this.barChart) {
      this.barChart.data.datasets[0].data = this.monthlyData;
      this.barChart.update();
    }
    if (this.pieChart) {
      this.pieChart.data.datasets[0].data = this.weekendWeekdayData;
      this.pieChart.update();
    }
  }

  get currentProperty() {
    return this.properties[this.currentPropertyIndex];
  }

  ngOnDestroy() {
    if (this.barChart) this.barChart.destroy();
    if (this.pieChart) this.pieChart.destroy();
  }
}
