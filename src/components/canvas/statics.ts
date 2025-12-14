import { useKTX2 } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

export function useStatics() {
  const urls = useMemo(
    () => [
      '/images/ktx3/1-mehmet-erzincan-portfolio.ktx2',
      '/images/ktx3/1-prod-antzoulis-main-book.ktx2',
      '/images/ktx3/8-kawa-h-pour-main-portfolio.ktx2',
      '/images/ktx3/8-mateusz-stankiewicz-main-book.ktx2',
      '/images/ktx3/11-omar-khaleel-main-book.ktx2',
      '/images/ktx3/12-kian-kanani-commercial-portrait.ktx2',
      '/images/ktx3/14-omar-khaleel-main-book.ktx2',
      '/images/ktx3/33-mehmet-erzincan-portfolio.ktx2',
      '/images/ktx3/42-luka-booth-main-book.ktx2',
      '/images/ktx3/49-luka-booth-main-book.ktx2',
      '/images/ktx3/51-pablo-patane-main-book.ktx2',
      '/images/ktx3/60-malak-kabbani-portfolio.ktx2',
      '/images/ktx3/63-pablo-patane-main-book.ktx2',
      '/images/ktx3/66-prod-antzoulis-main-book.ktx2',
      '/images/ktx3/1-mehmet-erzincan-portfolio.ktx2',
      '/images/ktx3/1-prod-antzoulis-main-book.ktx2',
      '/images/ktx3/8-kawa-h-pour-main-portfolio.ktx2',
      '/images/ktx3/8-mateusz-stankiewicz-main-book.ktx2',
      '/images/ktx3/11-omar-khaleel-main-book.ktx2',
      '/images/ktx3/12-kian-kanani-commercial-portrait.ktx2',
      '/images/ktx3/14-omar-khaleel-main-book.ktx2',
      '/images/ktx3/33-mehmet-erzincan-portfolio.ktx2',
      '/images/ktx3/42-luka-booth-main-book.ktx2',
      '/images/ktx3/49-luka-booth-main-book.ktx2',
      '/images/ktx3/51-pablo-patane-main-book.ktx2',
      '/images/ktx3/60-malak-kabbani-portfolio.ktx2',
      '/images/ktx3/63-pablo-patane-main-book.ktx2',
      '/images/ktx3/66-prod-antzoulis-main-book.ktx2',
      '/images/ktx2/6.ktx2',
      '/images/ktx2/7.ktx2',
      '/images/ktx2/8.ktx2',
      '/images/ktx2/9.ktx2',
    ],
    []
  )
  const textures = useKTX2(urls) as THREE.Texture[]

  const artists = useMemo(
    () => [
      'Armin Morbach',
      'Bachir Tayachi',
      'Frederico Martins',
      'Luka Booth',
      'Graham Tooby',
      'Hayat Osamah',
      'Jonas Jensen',
      'Mehmet Erzincan',
      'Mateusz Stankiewicz',
      'Mohamed Sherif',
      'Prod Antzoulis',
      'Robin Berglund',
      'Omar Khaleel',
      'Judas Mordache',
      'Kian Kanani',
      'Armin Morbach',
      'Bachir Tayachi',
      'Frederico Martins',
      'Luka Booth',
      'Graham Tooby',
      'Hayat Osamah',
      'Jonas Jensen',
      'Mehmet Erzincan',
      'Mateusz Stankiewicz',
      'Mohamed Sherif',
      'Prod Antzoulis',
      'Robin Berglund',
      'Omar Khaleel',
      'Judas Mordache',
      'Kian Kanani',
      'Armin Morbach',
      'Bachir Tayachi',
    ],
    []
  )

  // Shared uniform to broadcast the same value to all materials without loops each frame
  // Shared uniforms (one object referenced by all materials)
  const sharedStackScale = useMemo(() => new THREE.Uniform(0.6), [])
  const sharedCornerLen = useMemo(() => new THREE.Uniform(0.02), [])
  const sharedCornerThick = useMemo(() => new THREE.Uniform(0.006), [])
  const sharedCornerAlpha = useMemo(() => new THREE.Uniform(1.0), [])
  const sharedAspect = useMemo(() => new THREE.Uniform(1.0), [])
  const sharedTime = useMemo(() => new THREE.Uniform(0), [])
  const sharedResolution = useMemo(() => new THREE.Uniform(0), [])

  const defaultDuration = 1.5
  const textDuration = 2
  // Scroll moved to shader
  const sharedScroll = useMemo(() => new THREE.Uniform(0), [])
  const zMin = 4 // near
  const zMax = 8 // far
  const targetWidth = 2.25
  const targetHeight = 4.0
  const gap = 2.8
  const widthGap = 0.5

  const sizes = useMemo(() => {
    // cursor tracks the cumulative height of previous images plus gaps
    let cursor = 0
    let cursorWidth = 0
    return textures.map((tex) => {
      // image can be HTMLImageElement, ImageBitmap, or Canvas
      // tex.needsUpdate = false
      const img: any = tex.image
      const w = img?.naturalWidth ?? img?.width ?? 1
      const h = img?.naturalHeight ?? img?.height ?? 1
      const aspect = w / h
      const width = targetWidth
      const height = width / aspect

      const heightHorizontal = targetHeight
      const widthHorizontal = heightHorizontal * aspect

      // This offset places the current plane directly under the previous one:
      // offset = sum(prevHeights + gaps) + currentHeight/2
      const offset = cursor + height * 0.5
      const offsetWidth = cursorWidth + widthHorizontal * 0.5
      // advance cursor for the next item (add current height and gap)
      cursor += height + gap
      cursorWidth += widthHorizontal + widthGap

      // Set texture sampling defaults
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
      tex.generateMipmaps = false
      tex.needsUpdate = true
      return { width, height, offset, offsetWidth, widthHorizontal, heightHorizontal }
    })
  }, [textures, gap])

  return {
    urls,
    sharedStackScale,
    sharedCornerLen,
    sharedCornerThick,
    sharedCornerAlpha,
    sharedAspect,
    sharedResolution,
    sharedTime,
    defaultDuration,
    textDuration,
    sharedScroll,
    zMin,
    zMax,
    sizes,
    textures,
    artists,
  }
}

// Image URLs
