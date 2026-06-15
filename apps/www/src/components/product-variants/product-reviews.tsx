"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@eurofit/ui/components/avatar"
import { Badge } from "@eurofit/ui/components/badge"
import { Button } from "@eurofit/ui/components/button"
import { Card } from "@eurofit/ui/components/card"
import { Progress } from "@eurofit/ui/components/progress"
import { ChevronRight, Star } from "lucide-react"

interface ReviewData {
  id: string
  author: string
  avatar: string
  isVerified: boolean
  rating: number
  text?: string
  date: string
  likes: number
  replies: number
}

const SAMPLE_REVIEWS: ReviewData[] = [
  {
    id: "1",
    author: "Cristofer Torff",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    isVerified: true,
    rating: 5,
    text: "Almost complete building my replacement website and very pleased with the result, although the customization is freate the theme&apos;s features and customer support have also been great.",
    date: "5-7-2025",
    likes: 25,
    replies: 1,
  },
  {
    id: "2",
    author: "Cra Baptista",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    isVerified: true,
    rating: 5,
    text: "Really nicely designed theme and quite fast loading, the quickness of page loads you can really appreciateonce you turn off page transition theme options. Custom support was really quick to respond to all my questions and resolve all my issues.",
    date: "11-12-2023",
    likes: 33,
    replies: 3,
  },
  {
    id: "3",
    author: "Cheyenne",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    isVerified: true,
    rating: 5,
    // text: 'Very high quality theme and perfect for any business model that wants to showcase it&apos;s products or services. Great work!',
    date: "10-15-2025",
    likes: 20,
    replies: 0,
  },
]

const RATING_DISTRIBUTION = [
  { stars: 5, count: 45 },
  { stars: 4, count: 12 },
  { stars: 3, count: 5 },
  { stars: 2, count: 2 },
  { stars: 1, count: 1 },
]

const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1505121992542-f48db45923f1?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=80&h=80&fit=crop",
]

function RatingStars({
  rating,
  size = "sm",
}: {
  rating: number
  size?: "sm" | "md" | "lg"
}) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeMap[size]} ${
            i < rating ? "fill-orange-400 text-orange-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

function RatingDistribution() {
  const totalReviews = RATING_DISTRIBUTION.reduce(
    (sum, item) => sum + item.count,
    0
  )

  return (
    <div className="space-y-2">
      {RATING_DISTRIBUTION.map((item) => (
        <div key={item.stars} className="flex items-center gap-3">
          <div className="flex w-8 items-center gap-1">
            <span className="text-sm font-medium">{item.stars}</span>
            <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
          </div>
          <Progress
            value={(item.count / totalReviews) * 100}
            className="h-2 flex-1"
          />
          <span className="text-xs text-gray-600">{item.count}</span>
        </div>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: ReviewData }) {
  return (
    <Card className="rounded-none border-b p-4 last:border-b-0">
      <div className="mb-2 flex gap-3">
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={review.avatar} alt={review.author} />
          <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-semibold">{review.author}</span>
            {review.isVerified && (
              <Badge className="bg-green-50 text-green-700">Verified</Badge>
            )}
          </div>
          <RatingStars rating={review.rating} size="sm" />
        </div>
      </div>
      {review.text && (
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          {review.text}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{review.date}</span>
        {/* <div className="flex items-center gap-3">
          <button className="hover:text-muted-foreground flex items-center gap-1 transition-colors">
            <ThumbsUp className="size-4" />
            <span>{review.likes}</span>
          </button>
          <button className="hover:text-muted-foreground flex items-center gap-1 transition-colors">
            <MessageCircle className="size-4" />
            <span>{review.replies}</span>
          </button>
        </div> */}
      </div>
    </Card>
  )
}

export function ProductReviews() {
  const averageRating = 4.0
  const totalReviews = 65

  return (
    <div className="my-6 w-full bg-muted py-6 md:p-8">
      <div className="mx-auto mt-4 mb-6 text-center">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
      </div>
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-background">
        {/* Rating Summary Section */}
        <div className="flex flex-col gap-8 border-b p-6 md:flex-row">
          {/* Rating Display */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{averageRating}</span>
              <span className="text-2xl text-muted-foreground">/5</span>
            </div>
            <RatingStars rating={Math.round(averageRating)} size="md" />
            <p className="mt-2 text-xs text-gray-600">
              Based on {totalReviews} verified reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1">
            <RatingDistribution />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 md:ml-auto">
            <Button>Write a review</Button>
            <Button variant="link">Ask a question</Button>
          </div>
        </div>

        {/* Customer Photos & Videos */}
        <div className="border-b p-6">
          <h3 className="mb-3 text-sm font-semibold">
            Customer Photos & videos
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {SAMPLE_PHOTOS.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Customer content ${idx + 1}`}
                className="size-20 shrink-0 cursor-pointer rounded object-cover transition-opacity hover:opacity-80"
              />
            ))}
            <button className="flex size-20 shrink-0 items-center justify-center rounded bg-gray-200 transition-colors hover:bg-gray-300">
              <ChevronRight className="size-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="divide-y">
          {SAMPLE_REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* View More Reviews */}
        <div className="border-t p-6 text-center">
          <Button variant="outline" className="w-full">
            View all reviews
          </Button>
        </div>
      </div>
    </div>
  )
}
