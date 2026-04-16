import { NextRequest, NextResponse } from 'next/server'

// Mock data - replace with real database calls
let aboutContent: any[] = [
  {
    id: '1',
    section: 'mission',
    title: 'Our Mission',
    content: 'To revolutionize logistics in Africa through innovative technology, reliable partnerships, and exceptional service delivery. We connect businesses with logistics solutions they need to thrive in modern economy.',
    order: 1,
    updatedAt: '2024-01-01',
    image: '/mission-image.jpg'
  },
  {
    id: '2',
    section: 'vision',
    title: 'Our Vision',
    content: 'To become the leading logistics platform in Africa, empowering businesses of all sizes with cutting-edge technology and a network of trusted partners.',
    order: 2,
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    section: 'values',
    title: 'Our Values',
    content: 'Innovation, Reliability, Partnership, Excellence, and Customer-Centric approach guide everything we do at Fretiko.',
    order: 3,
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    section: 'team',
    title: 'Our Team',
    content: 'Founded by a team of passionate entrepreneurs and technologists, Fretiko brings together diverse expertise from logistics, technology, and business.',
    order: 4,
    updatedAt: '2024-01-01'
  },
  {
    id: '5',
    section: 'achievements',
    title: 'Our Achievements',
    content: 'In just a few years, we\'ve made significant progress toward our vision of transforming African logistics. Founded in 2023, we\'ve helped thousands of businesses streamline their operations, expanded to multiple countries, and achieved 99.5% on-time delivery rate.',
    order: 5,
    updatedAt: '2024-01-01'
  }
]

export async function GET() {
  try {
    // TODO: Add authentication and authorization
    return NextResponse.json({
      success: true,
      content: aboutContent.sort((a, b) => a.order - b.order)
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // TODO: Add validation
    const newContent = {
      id: Date.now().toString(),
      section: body.section,
      title: body.title,
      content: body.content,
      order: body.order || 1,
      updatedAt: new Date().toISOString().split('T')[0],
      image: body.image
    }

    // TODO: Save to database
    aboutContent.push(newContent)

    return NextResponse.json({
      success: true,
      content: newContent,
      message: 'About content created successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create about content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json()
    const body = await request.json()
    
    const contentIndex = aboutContent.findIndex(content => content.id === id)
    
    if (contentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'About content not found' },
        { status: 404 }
      )
    }

    aboutContent[contentIndex] = {
      ...aboutContent[contentIndex],
      section: body.section || aboutContent[contentIndex].section,
      title: body.title || aboutContent[contentIndex].title,
      content: body.content || aboutContent[contentIndex].content,
      order: body.order || aboutContent[contentIndex].order,
      updatedAt: new Date().toISOString().split('T')[0],
      image: body.image || aboutContent[contentIndex].image
    }

    // TODO: Update in database

    return NextResponse.json({
      success: true,
      content: aboutContent[contentIndex],
      message: 'About content updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    const contentIndex = aboutContent.findIndex(content => content.id === id)
    
    if (contentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'About content not found' },
        { status: 404 }
      )
    }

    aboutContent.splice(contentIndex, 1)

    // TODO: Delete from database

    return NextResponse.json({
      success: true,
      message: 'About content deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete about content' },
      { status: 500 }
    )
  }
}
