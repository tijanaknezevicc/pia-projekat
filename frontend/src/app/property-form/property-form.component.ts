import { Component, inject, OnInit } from '@angular/core';
import { PropertyService } from '../services/property.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { Property } from '../models/property';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './property-form.component.html',
  styleUrl: './property-form.component.css'
})
export class PropertyFormComponent implements OnInit {

  private fb = inject(FormBuilder)
  private propertyService = inject(PropertyService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  propertyForm!: FormGroup
  editing = false
  user!: User
  selectedFiles: File[] = []
  imagePreviewUrls: string[] = []
  existingImages: string[] = []
  property!: Property
  backendUrl: string = "http://localhost:4000/assets/"
  selectedJson: File | null = null

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('logged')!);
    this.initializeForm();

    let propertyName = this.route.snapshot.paramMap.get('name');
    if (propertyName) {
      this.editing = true;
      this.propertyService.getPropertyByName(propertyName).subscribe(data => {
        this.property = data
        this.loadPropertyForEdit();
      })
    }
  }

  initializeForm() {
    this.propertyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      owner: [this.user?.username || '', Validators.required],
      services: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      pricing: this.fb.group({
        summer: [0, [Validators.required, Validators.min(1)]],
        winter: [0, [Validators.required, Validators.min(1)]]
      }),
      coordinates: this.fb.group({
        x: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
        y: [0, [Validators.required, Validators.min(-90), Validators.max(90)]]
      }),
      images: this.fb.array([])
    });
  }

  get imagesFormArray(): FormArray {
    return this.propertyForm.get('images') as FormArray;
  }

  loadPropertyForEdit() {
    this.propertyForm.patchValue({
      name: this.property.name,
      location: this.property.location,
      owner: this.property.owner,
      services: this.property.services,
      phone: this.property.phone,
      pricing: {
        summer: this.property.pricing.summer,
        winter: this.property.pricing.winter
      },
      coordinates: {
        x: this.property.coordinates.x,
        y: this.property.coordinates.y
      }
    });

    this.existingImages = this.property.images || []

    this.existingImages.forEach(imageUrl => {
      this.imagesFormArray.push(this.fb.control(imageUrl))
    })
  }


  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files)

      files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`fajl je prevelik`)
          return
        }

        this.selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          const previewUrl = e.target?.result as string;
          this.imagePreviewUrls.push(previewUrl)

          this.imagesFormArray.push(this.fb.control(previewUrl))
        };
        reader.readAsDataURL(file)
      })
    }

    input.value = ''
  }

  removeImage(index: number): void {
    if (index < this.existingImages.length) {
      this.existingImages.splice(index, 1)
    } else {
      const selectedFileIndex = index - this.existingImages.length;
      this.selectedFiles.splice(selectedFileIndex, 1)
      this.imagePreviewUrls.splice(selectedFileIndex, 1)
    }

    this.imagesFormArray.removeAt(index);
  }

  getAllImages(): string[] {
    return [...this.existingImages, ...this.imagePreviewUrls]
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      const formData = new FormData()

      const propertyData = {
        name: this.propertyForm.get('name')?.value,
        location: this.propertyForm.get('location')?.value,
        owner: this.propertyForm.get('owner')?.value,
        services: this.propertyForm.get('services')?.value,
        phone: this.propertyForm.get('phone')?.value,
        pricing: this.propertyForm.get('pricing')?.value,
        coordinates: this.propertyForm.get('coordinates')?.value,
        images: this.existingImages
      }

      formData.append('property', JSON.stringify(propertyData));

      this.selectedFiles.forEach(file => {
        formData.append(`images`, file)
      })

      if (this.editing) {
        this.updateProperty(formData)
      } else {
        this.addProperty(formData)
      }
    } else {
      this.markFormGroupTouched()
    }
  }

  private addProperty(formData: FormData): void {
    this.propertyService.addProperty(formData).subscribe({
      next: (ok) => {
        alert('vikendica dodata')
        this.router.navigate(['/my-properties'])
      },
      error: (err) => {
        alert('greska')
      }
    })
  }

  private updateProperty(formData: FormData): void {
    this.propertyService.updateProperty(this.property.name,formData).subscribe({
      next: (ok) => {
        alert('vikendica azurirana')
        this.router.navigate(['/my-properties'])
      },
      error: (err) => {
        alert('greska')
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.propertyForm.controls).forEach(key => {
      const control = this.propertyForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.propertyForm.get(fieldName)
    return !!(field && field.invalid && field.touched)
  }

  isNestedFieldInvalid(groupName: string, fieldName: string): boolean {
    const field = this.propertyForm.get(`${groupName}.${fieldName}`)
    return !!(field && field.invalid && field.touched)
  }

  getFieldError(fieldName: string): string {
    const field = this.propertyForm.get(fieldName)
    if (field?.errors) {
      if (field.errors['required']) return `polje je obavezno`
      if (field.errors['minlength']) return `polje mora imati najmanje ${field.errors['minlength'].requiredLength} karaktera`
      if (field.errors['min']) return `vrednost mora biti veca od ${field.errors['min'].min}`
      if (field.errors['max']) return `vrednost mora biti manja od ${field.errors['max'].max}`
      if (field.errors['pattern']) return `polje ima neispravnu vrednost`
    }
    return ''
  }

  cancel() {
    this.router.navigate(['/my-properties'])
  }

  onJsonFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]

      if (!file.name.toLowerCase().endsWith('.json')) {
        alert('pogresan tip fajla')
        input.value = ''
        return
      }

      this.selectedJson = file;
      this.loadJsonData(file);
    }
  }

  loadJsonData(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonContent = e.target?.result as string;
        const propertyData = JSON.parse(jsonContent);

        this.populateFormFromJson(propertyData);

      } catch (error) {
        alert('greska')
        this.selectedJson = null
      }
    }
    reader.readAsText(file)
  }

  populateFormFromJson(data: any) {
    try {
      if (data.name) this.propertyForm.patchValue({name: data.name});
      if (data.location) this.propertyForm.patchValue({location: data.location});
      if (data.services) this.propertyForm.patchValue({services: data.services});
      if (data.phone) this.propertyForm.patchValue({phone: data.phone});

      if (data.pricing) {
        this.propertyForm.patchValue({
          pricing: {
            summer: data.pricing.summer || 0,
            winter: data.pricing.winter || 0
          }
        });
      }

      if (data.coordinates) {
        this.propertyForm.patchValue({
          coordinates: {
            x: data.coordinates.x || 0,
            y: data.coordinates.y || 0
          }
        })
      }

    } catch (error) {
      alert('greska')
    }
  }
}
