import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { UserService } from 'src/users/users.service'
import { JwtService } from './jwt.service'

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}
  async use(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt']
      const decoded = this.jwtService.verify(
        token.toString()
      )
      if (
        typeof decoded === 'object' &&
        decoded.hasOwnProperty('id')
      ) {
        try {
          const {
            user,
            ok,
          } = await this.userService.findById(decoded['id'])
          if (ok) {
            req['user'] = user
          }
        } catch (e) {}
      }
    }
    next()
  }
}

// 단독으로 쓸려면 이렇게 쓸 수도 있다
// 하지만 users repository를 가져올거면 클래스를 사용해야한다
// export function JwtMiddleware(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   console.log(req.headers)
//   next()
// }
