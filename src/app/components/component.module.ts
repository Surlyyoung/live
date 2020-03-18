import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';

@NgModule({
  declarations: [ImageUploaderComponent],
  imports: [CommonModule, NzPaginationModule, NzInputModule, FormsModule],
  exports: [ImageUploaderComponent],
})
export class ComponentModule {}
