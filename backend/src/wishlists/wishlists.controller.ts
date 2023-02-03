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
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Post()
  createWishlist(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get()
  getWishlists() {
    return this.wishlistsService.findMany();
  }

  @Get(':id')
  getWishlist(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  updateWishlist(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    return this.wishlistsService.updateOne(id, updateWishlistDto, req.user);
  }

  @Delete(':id')
  removeWishlist(@Param('id') id: number, @Req() req) {
    return this.wishlistsService.removeOne(id, req.user.id);
  }
}
