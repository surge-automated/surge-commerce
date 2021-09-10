import { ChangeEvent, useEffect, useState } from 'react'
import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import s from './CartItem.module.css'
import { Trash, Plus, Minus } from '@components/icons'
import { useUI } from '@components/ui/context'
import type { LineItem } from '@framework/types'

type ItemOption = {
  name: string
  nameId: number
  value: string
  valueId: number
}

const CartItem = ({
  item,
  currencyCode,
  image,
  ...rest
}: {
  item: LineItem
  currencyCode: string
  image: string
}) => {
  const { closeSidebarIfPresent } = useUI()
  const [quantity, setQuantity] = useState(item.quantity)
  const [removing, setRemoving] = useState(false)

  const options = (item as any).options

  useEffect(() => {
    // Reset the quantity state if the item quantity changes
    if (item.quantity !== Number(quantity)) {
      setQuantity(item.quantity)
    }
  }, [item.quantity])

  return (
    <li
      className={cn('flex flex-row space-x-8 py-8', {
        'opacity-75 pointer-events-none': removing,
      })}
      {...rest}
    >
      <div className="w-16 h-16 bg-violet relative overflow-hidden cursor-pointer">
        <Link href={`/product/test`}>
          <Image
            onClick={() => closeSidebarIfPresent()}
            className={s.productImage}
            width={150}
            height={150}
            src={image! || ''}
            alt={'item.variant.image!.altText'}
            unoptimized
          />
        </Link>
      </div>
      <div className="flex-1 flex flex-col text-base">
        <Link href={`/product/test}`}>
          <span
            className="font-bold text-lg cursor-pointer leading-6"
            onClick={() => closeSidebarIfPresent()}
          >
            {item.name}
          </span>
        </Link>
        {options && options.length > 0 ? (
          <div className="">
            {options.map((option: ItemOption, i: number) => (
              <span
                key={`${item.id}-${option.name}`}
                className="text-sm font-semibold text-accents-7"
              >
                {option.value}
                {i === options.length - 1 ? '' : ', '}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex items-center mt-3">
          <button type="button" onClick={() => console.log('decrease')}>
            <Minus width={18} height={18} />
          </button>
          <label>
            <input
              type="number"
              max={99}
              min={0}
              className={s.quantity}
              value={quantity}
              // onChange={handleQuantity}
              // onBlur={handleBlur}
            />
          </label>
          <button type="button" onClick={() => console.log('increase')}>
            <Plus width={18} height={18} />
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-between space-y-2 text-base">
        <span>{item?.variant?.price}</span>
        <button
          className="flex justify-end outline-none"
          onClick={() => console.log('Remove')}
        >
          <Trash />
        </button>
      </div>
    </li>
  )
}

export default CartItem
