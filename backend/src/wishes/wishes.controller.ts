import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createWish(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get('last')
  getWishesLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  getWishesTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getWish(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateWish(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    return this.wishesService.updateOne(id, updateWishDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeWish(@Param('id') id: number, @Req() req) {
    return this.wishesService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req) {
    return this.wishesService.updateCopied(id, req.user.id);
  }
}
