import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Button, Pagination } from '../../../components/ui';
import EmptyState from '../../../components/common/EmptyState';
import { usePaginatedList } from '../../../hooks/usePaginatedList';

const WISHLIST_PER_PAGE = 4;

export default function WishlistTab({
  wishlistItems,
  onOpenProduct,
  onMoveToCart,
  onRemove,
}) {
  const navigate = useNavigate();
  const { page, setPage, pageSize, totalItems, paginatedItems } = usePaginatedList(
    wishlistItems,
    WISHLIST_PER_PAGE
  );

  return (
    <div className="cf-cust-tab-panel">
      <div className="cf-panel-header">
        <div>
          <h2 className="cf-panel-title">My Wishlist</h2>
          <p className="cf-panel-subtitle">
            Click any saved item to open its product page, or move it directly to your bag.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/shop')}>
          Explore Store
        </Button>
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love while browsing so you can easily find and buy them later."
          actionLabel="Browse Products"
          onAction={() => navigate('/shop')}
        />
      ) : (
        <>
          <div className="cf-wishlist-list">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                className="cf-wishlist-row cf-clickable-product-row"
                onClick={() => onOpenProduct(item.id)}
                title="Click to view product details"
              >
                <img src={item.imageUrl} alt={item.title} className="cf-wishlist-thumb" />
                <div className="cf-wishlist-info">
                  <span className="cf-wishlist-cat">{item.category}</span>
                  <h4 className="cf-wishlist-title">{item.title}</h4>
                  <div className="cf-wishlist-price-row">
                    <span className="cf-wishlist-price">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="cf-wishlist-mrp">
                        ₹{Number(item.originalPrice).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="cf-wishlist-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="sm"
                    variant="primary"
                    icon={ShoppingBag}
                    onClick={() => onMoveToCart(item)}
                  >
                    Move to Bag
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Trash2}
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="cf-cust-pagination-wrap">
            <Pagination
              currentPage={page}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
