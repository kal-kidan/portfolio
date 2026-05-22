import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Wire JwtStrategy in an AuthModule before using this guard on routes. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
