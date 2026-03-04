import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MenuController } from './menu.controller';
import { MenuService } from './services/menu.service';
import { MenuCategory } from './entities/menu-category.entity';
import { MenuItem } from './entities/menu-item.entity';
import { MenuModifier } from './entities/menu-modifier.entity';

@Module({
  imports: [MikroOrmModule.forFeature([MenuCategory, MenuItem, MenuModifier])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
