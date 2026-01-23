const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80'

function ProductImage({ imageUrl, name }) {
    return (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <img
                src={imageUrl || FALLBACK_IMAGE}
                alt={name || 'Menu item'}
                className="h-80 w-full object-cover sm:h-[420px]"
                loading="lazy"
            />
        </div>
    )
}

export default ProductImage
